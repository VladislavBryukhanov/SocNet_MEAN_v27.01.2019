import { Component, OnInit } from '@angular/core';
import {BlogService} from '../../services/blog.service';
import {ActivatedRoute} from '@angular/router';
import {Blog} from '../../models/blog';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {

  public blog: Blog[] = [];

  constructor(public blogService: BlogService, private router: ActivatedRoute) { }

  ngOnInit() {
    this.blogService.getBlog(this.router.snapshot.params['id']);
  }

}
