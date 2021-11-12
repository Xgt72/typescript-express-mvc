import * as express from "express";
import Controller from "../interfaces/controller.interface";
import Post from "./post.interface";
import postModel from "./posts.model";
import PostNotFoundException from "../exceptions/PostNotFoundException";
import validationMiddleware from "../middleware/validation.middleware";
import CreatePostDto from "./post.dto";
import authMiddleware from "../middleware/auth.middleware";
import RequestWithUser from "../interfaces/requestWithUser.interface";

class PostsController implements Controller {
  public path = "/posts";
  public router = express.Router();
  private post = postModel;

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(this.path, this.getAllPosts);
    this.router.get(`${this.path}/:id`, this.getPostById);
    this.router
      .all(`${this.path}/*`, authMiddleware)
      .patch(
        `${this.path}/:id`,
        validationMiddleware(CreatePostDto, true),
        this.modifyPost
      )
      .delete(`${this.path}/:id`, this.deletePost)
      .post(this.path, validationMiddleware(CreatePostDto), this.createPost);
  }

  private getAllPosts = (
    request: express.Request,
    response: express.Response
  ) => {
    this.post.find().then((posts) => {
      response.json(posts);
    });
  };

  private getPostById = (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const { id } = request.params;
    this.post
      .findById(id)
      .then((post) => {
        if (post) {
          response.json(post);
        } else {
          next(new PostNotFoundException(id));
        }
      })
      .catch((err) => {
        next(new PostNotFoundException(id));
      });
  };

  private createPost = async (
    request: RequestWithUser,
    response: express.Response
  ) => {
    const postData: Post = request.body;
    const createdPost = new this.post({
      ...postData,
      authorId: request.user._id,
    });
    const savedPost = await createdPost.save();
    response.status(201).json(savedPost);
  };

  private modifyPost = (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const { id } = request.params;
    const postData: Post = request.body;
    this.post.findByIdAndUpdate(id, postData, { new: true }).then((post) => {
      if (post) {
        response.json(post);
      } else {
        next(new PostNotFoundException(id));
      }
    });
  };

  private deletePost = (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const { id } = request.params;
    this.post.findByIdAndDelete(id).then((successResponse) => {
      if (successResponse) {
        response.sendStatus(204);
      } else {
        next(new PostNotFoundException(id));
      }
    });
  };
}

export default PostsController;
