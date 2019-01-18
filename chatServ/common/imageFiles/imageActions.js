const path = require('path');
const fs = require('fs');
const uuid = require('uuid');
const sharp = require('sharp');
const Image = require('../../models/image');

const resizeAndSaveImage = async (files, filePath, fileSize) => {
    const attachedFiles = [];
    const imageUploading = [];

    if(files.length > 0) {
        files.forEach((file) => {
            const filename = `${file.fieldname}-${uuid.v1()}${path.extname(file.originalname)}`;

            fileSize.forEach(sizeMode => {
                imageUploading.push(
                    sharp(file.buffer)
                        .resize(null, sizeMode.size)
                        .toFile(`public/${filePath}${sizeMode.name}/${filename}`)
                )
            });

            imageUploading.push(
                new Promise((resolve, reject) => {
                    fs.writeFile(`public/${filePath}${filename}`, file.buffer, () => {
                        Image.create({filePath: filePath, fileName: filename})
                            .then((res) => {
                                attachedFiles.push(res._id);
                                resolve();
                            });
                    });
                })
            );
        });
    } else {
        return [];
    }
    await Promise.all(imageUploading);
    return attachedFiles;
};

const deleteAttachedFiles = (files, fileSize) => {
    files.forEach(file => {
        const {fileName, filePath, _id} = file;
        fs.unlink(`public/${filePath + fileName}`,
            err => console.log(err));
        fileSize.forEach(sizeMode => {
            fs.unlink(`public/${filePath + sizeMode.name}/${fileName}`,
                err => console.log(err));
        });
        Image.findOneAndDelete(_id)
            .catch(err => console.log(err));
    });
};

module.exports.deleteAttachedFiles = deleteAttachedFiles;

module.exports.resizeAndSaveImage = resizeAndSaveImage;