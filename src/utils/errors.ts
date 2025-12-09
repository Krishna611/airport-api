import { Request, Response, NextFunction } from "express";

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  console.error(err);
  if (err && err.name === "EntityNotFound") {
    return res.status(404).json({ message: "Not found" });
  }
  return res.status(500).json({ message: "Internal Server Error", details: err?.message ?? err });
}
