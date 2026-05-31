import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { Request, Response, NextFunction, RequestHandler } from "express";

type ValidationSource = "body" | "params" | "query";

export const validateDto = (
  DtoClass: new () => object,
  source: ValidationSource = "body"
): RequestHandler => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const dto = plainToInstance(
      DtoClass,
      req[source]
    );

    const errors = await validate(dto);

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        errors: errors.map((error) => ({
          property: error.property,
          constraints: error.constraints,
        })),
      });
    }

    req[source] = dto as any;

    next();
  };
};