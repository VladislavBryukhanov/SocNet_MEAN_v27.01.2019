import { ImageResizerPipe } from './image-resizer.pipe';

describe('ImageResizerPipe', () => {
  it('create an instance', () => {
    const pipe = new ImageResizerPipe();
    expect(pipe).toBeTruthy();
  });
});
