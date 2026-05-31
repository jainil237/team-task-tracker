import { AppDataSource } from "../config/database";
import { Project } from "../entities/Project";

export class ProjectRepository {
  private repo = AppDataSource.getRepository(Project);

  async create(project: Partial<Project>): Promise<Project> {
    const entity = this.repo.create(project);
    return this.repo.save(entity);
  }

  async findById(id: string): Promise<Project | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findByIdAndOrganization(id: string, organizationId: string): Promise<Project | null> {
    return this.repo.findOne({ where: { id, organizationId } });
  }

  async findAllByOrganization(organizationId: string): Promise<Project[]> {
    return this.repo.find({
      where: { organizationId },
      order: { createdAt: "DESC" },
    });
  }

  async update(project: Project): Promise<Project> {
    return this.repo.save(project);
  }

  async deleteById(id: string): Promise<void> {
    await this.repo.delete({ id });
  }
}