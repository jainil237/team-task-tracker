import { ProjectRepository } from "../repositories/project.repository";
import { CreateProjectDTO, UpdateProjectDTO } from "../DTOs/project.dto";
import { UserRole } from "../entities/enum";
import { AuthUserInterface } from "../interfaces/auth-user.interface";

export class AppError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
  }
}

export class ProjectService {
  constructor(private readonly projectRepository = new ProjectRepository()) {}

  private assertCanMutate(user: AuthUserInterface) {
    if (user.role !== UserRole.ADMIN && user.role !== UserRole.MANAGER) {
      throw new AppError(403, "Only ADMIN or MANAGER can manage projects");
    }
  }

  async createProject(user: AuthUserInterface, input: CreateProjectDTO) {
    this.assertCanMutate(user);

    return this.projectRepository.create({
      organizationId: user.organizationId,
      name: input.name.trim(),
    });
  }

  async getProjectById(user: AuthUserInterface, id: string) {
    const project = await this.projectRepository.findByIdAndOrganization(id, user.organizationId);
    if (!project) {
      throw new AppError(404, "Project not found");
    }
    return project;
  }

  async listProjects(user: AuthUserInterface) {
    return this.projectRepository.findAllByOrganization(user.organizationId);
  }

  async updateProject(user: AuthUserInterface, id: string, input: UpdateProjectDTO) {
    this.assertCanMutate(user);

    const project = await this.projectRepository.findByIdAndOrganization(id, user.organizationId);
    if (!project) {
      throw new AppError(404, "Project not found");
    }

    if (input.name !== undefined) {
      project.name = input.name.trim();
    }

    return this.projectRepository.update(project);
  }

  async deleteProject(user: AuthUserInterface, id: string) {
    this.assertCanMutate(user);

    const project = await this.projectRepository.findByIdAndOrganization(id, user.organizationId);
    if (!project) {
      throw new AppError(404, "Project not found");
    }

    await this.projectRepository.deleteById(id);
  }
}