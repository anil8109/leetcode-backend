import { CreateProblemDto, UpdateProblemDto } from "../validators/problem.validator";
import { IProblem } from "../models/problem.model";
import { IProblemRepository } from "../repositories/problem.repository";
import { BadRequestError, NotFoundError } from "../utils/errors/app.error";
import { sanitizeMarkdown } from "../utils/markdown.sanitizer";

export interface IProblemService {
    createProblem(problem: Partial<CreateProblemDto>): Promise<IProblem>;
    getProblemById(id: string): Promise<IProblem | null>;
    getAllProblems(id: string): Promise<{ problems: IProblem[], total: number}>;
    updateProblem(id: string, updateData: UpdateProblemDto): Promise<IProblem | null>;
    deleteProblem(id: string): Promise<boolean>;
    findByDifficulty(dificulty: 'Easy'| 'Medium' | 'Hard'): Promise<IProblem[]>;
    searchProblems(query: string): Promise<IProblem[]>;
}

export class ProblemService implements IProblemService {
    private problemRepositry: IProblemRepository;

    constructor(problemRepositry: IProblemRepository) { // Contructor Injection
        this.problemRepositry = problemRepositry;
    }

    async createProblem(problem: CreateProblemDto): Promise<IProblem> {
        const sanitizedPayload = {
            ...problem,
            description: await sanitizeMarkdown(problem.description),
            editorial: problem.editorial && await sanitizeMarkdown(problem.editorial)
        };
        return await this.problemRepositry.createProblem(sanitizedPayload);
    }

    async getProblemById(id: string): Promise<IProblem | null> {
        const problem = await this.problemRepositry.getProblemById(id);
        if (!problem) {
            throw new NotFoundError("Problem not found");
        }
        return problem;
    }

    async getAllProblems(): Promise<{ problems: IProblem[]; total: number; }> {
        return this.problemRepositry.getAllProblems();
    }

    async updateProblem(id: string, updateData: UpdateProblemDto): Promise<IProblem | null> {
        const problem = await this.problemRepositry.getProblemById(id);
        if (!problem) {
            throw new NotFoundError("Problem not found");
        }

        const sanitizedPayload: Partial<IProblem> = {
            ...updateData
        };

        if (updateData.description) {
            sanitizedPayload.description = await sanitizeMarkdown(updateData.description);
        }
        if (updateData.editorial) {
            sanitizedPayload.editorial = await sanitizeMarkdown(updateData.editorial);
        }

        return await this.problemRepositry.updateProblem(id, sanitizedPayload);
    }

    async deleteProblem(id: string): Promise<boolean> {
        const result = this.problemRepositry.deleteProblem(id);
        if (!result) {
            throw new NotFoundError("Problem not found");
        }
        return result;
    }

    async findByDifficulty(difficulty: "Easy" | "Medium" | "Hard"): Promise<IProblem[]> {
        return await this.problemRepositry.findByDifficulty(difficulty);
    }

    async searchProblems(query: string): Promise<IProblem[]> {
        if (!query || query.trim() == '') {
            throw new BadRequestError("Query is required");
        }
        return await this.searchProblems(query);
    }
}
