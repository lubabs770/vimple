import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

export type Lesson = {
  index: number;
  name: string;
  dir: string;
  textPath: string;
  checkPath: string;
};

export function listLessons(repoRoot: string): Lesson[] {
  const root = join(repoRoot, "lessons");
  const names = readdirSync(root, { withFileTypes: true })
    .filter((e) => e.isDirectory() && /^\d+-/.test(e.name))
    .map((e) => e.name)
    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10));
  return names.map((name, index) => {
    const dir = join(root, name);
    return { index, name, dir, textPath: join(dir, "lesson.txt"), checkPath: join(dir, "check.test.ts") };
  });
}

export function getLessonText(lesson: Lesson): string {
  return readFileSync(lesson.textPath, "utf8");
}
