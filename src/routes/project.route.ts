import { Router } from "express";
import { ProjectController } from "../controllers/project.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/rbac.middleware";
import { UserRole } from "../entities/enum";
import { validateDto } from "../middlewares/dto-validator.middleware";
import { CreateProjectDTO, ProjectIdDTO, UpdateProjectDTO } from "../DTOs/project.dto";

const router = Router();
const controller = new ProjectController();

router.use(authMiddleware);

router.get(
  "/",
  controller.listProjects
);


router.get(
  "/:id",
  validateDto(ProjectIdDTO, "params"),
  controller.getProjectById
);


router.post(
  "/",
  requireRole(UserRole.ADMIN, UserRole.MANAGER),
  validateDto(CreateProjectDTO),
  controller.createProject
);

router.patch(
  "/:id",
  requireRole(UserRole.ADMIN, UserRole.MANAGER),
  validateDto(ProjectIdDTO),
  validateDto(UpdateProjectDTO),
  controller.updateProject
);

router.delete(
  "/:id",
  requireRole(UserRole.ADMIN, UserRole.MANAGER),
  validateDto(ProjectIdDTO),
  controller.deleteProject
);
export default router;