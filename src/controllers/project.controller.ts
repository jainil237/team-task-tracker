import { Request, Response, NextFunction } from "express";

import { ProjectService } from "../services/project.service";

import { AuthUserInterface } from "../interfaces/auth-user.interface";

import {
  CreateProjectDTO,
  UpdateProjectDTO,
  ProjectIdDTO,
} from "../DTOs/project.dto";

export class ProjectController {
  constructor(
    private readonly projectService = new ProjectService()
  ) {}

  createProject = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user = req.user as AuthUserInterface;
      const dto = req.body as CreateProjectDTO;

      console.log(user,"  ", dto)

      const project = await this.projectService.createProject(
        user,
        dto
      );

      return res.status(201).json({
        success: true,
        data: project,
      });
    } catch (error) {
      next(error);
    }
  };

  listProjects = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user = req.user as AuthUserInterface;

      const projects = await this.projectService.listProjects(user);

      return res.status(200).json({
        success: true,
        data: projects,
      });
    } catch (error) {
      next(error);
    }
  };

  getProjectById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user = req.user as AuthUserInterface;
      const params = req.params as unknown as ProjectIdDTO;

      const project = await this.projectService.getProjectById(
        user,
        params.id
      );

      return res.status(200).json({
        success: true,
        data: project,
      });
    } catch (error) {
      next(error);
    }
  };

  updateProject = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user = req.user as AuthUserInterface;

      const params = req.params as unknown as ProjectIdDTO;
      const dto = req.body as UpdateProjectDTO;

      const project = await this.projectService.updateProject(
        user,
        params.id,
        dto
      );

      return res.status(200).json({
        success: true,
        data: project,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteProject = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user = req.user as AuthUserInterface;
      const params = req.params as unknown as ProjectIdDTO;

      await this.projectService.deleteProject(
        user,
        params.id
      );

      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}