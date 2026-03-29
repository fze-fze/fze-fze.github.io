#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = process.env.HABIT_CHECKIN_ROOT
  ? path.resolve(process.env.HABIT_CHECKIN_ROOT)
  : path.resolve(__dirname, "..");

const habitConfig = {
  sleep: {
    label: "早睡",
    filePath: path.join(repoRoot, "src/data/sleepCheckins.ts")
  },
  mindfulness: {
    label: "正念",
    filePath: path.join(repoRoot, "src/data/mindfulnessCheckins.ts")
  }
};

function parseArgs(argv) {
  const args = {};

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];

    if (!token.startsWith("--")) continue;

    const key = token.slice(2);
    const value = argv[index + 1];

    if (!value || value.startsWith("--")) {
      throw new Error(`参数 ${token} 缺少值`);
    }

    args[key] = value;
    index += 1;
  }

  return args;
}

function parseDateParts(input) {
  if (!input) {
    const now = new Date();
    const effectiveDate = new Date(now);

    if (now.getHours() < 2) {
      effectiveDate.setDate(effectiveDate.getDate() - 1);
    }

    return {
      year: effectiveDate.getFullYear(),
      month: effectiveDate.getMonth() + 1,
      day: effectiveDate.getDate()
    };
  }

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(input);

  if (!match) {
    throw new Error("日期格式必须是 YYYY-MM-DD");
  }

  const [, yearRaw, monthRaw, dayRaw] = match;
  const year = Number(yearRaw);
  const month = Number(monthRaw);
  const day = Number(dayRaw);
  const candidate = new Date(year, month - 1, day);

  if (
    candidate.getFullYear() !== year ||
    candidate.getMonth() + 1 !== month ||
    candidate.getDate() !== day
  ) {
    throw new Error("日期无效，请检查年月日");
  }

  return { year, month, day };
}

function formatMonthKey({ year, month }) {
  return `${year}-${String(month).padStart(2, "0")}`;
}

function formatDateLabel({ year, month, day }) {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function parseCheckinObject(source) {
  const match = source.match(
    /(export const\s+\w+:\s+Record<string,\s*number\[]>\s*=\s*)(\{[\s\S]*?\})(\s*;)/
  );

  if (!match) {
    throw new Error("未找到可更新的打卡数据对象");
  }

  const [, prefix, objectLiteral, suffix] = match;
  const records = Function(`"use strict"; return (${objectLiteral});`)();

  return { prefix, objectLiteral, records, suffix };
}

function serializeRecords(records) {
  const monthKeys = Object.keys(records).sort((left, right) => left.localeCompare(right, "en"));
  const lines = monthKeys.map((monthKey) => {
    const days = [...new Set(records[monthKey])]
      .filter((day) => Number.isInteger(day) && day >= 1 && day <= 31)
      .sort((left, right) => left - right);

    return `  "${monthKey}": [${days.join(", ")}]`;
  });

  if (lines.length === 0) {
    return "{}";
  }

  return `{\n${lines.join(",\n")}\n}`;
}

async function updateCheckinFile(filePath, targetDate) {
  const source = await fs.readFile(filePath, "utf8");
  const { prefix, objectLiteral, records, suffix } = parseCheckinObject(source);
  const monthKey = formatMonthKey(targetDate);
  const day = targetDate.day;
  const existingDays = Array.isArray(records[monthKey]) ? records[monthKey] : [];
  const normalizedDays = [...new Set(existingDays)].sort((left, right) => left - right);
  const alreadyExists = normalizedDays.includes(day);

  if (!alreadyExists) {
    normalizedDays.push(day);
    normalizedDays.sort((left, right) => left - right);
  }

  records[monthKey] = normalizedDays;

  const nextObjectLiteral = serializeRecords(records);
  const nextSource = source.replace(`${prefix}${objectLiteral}${suffix}`, `${prefix}${nextObjectLiteral}${suffix}`);

  if (nextSource !== source) {
    await fs.writeFile(filePath, nextSource, "utf8");
  }

  return alreadyExists;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const habit = args.habit;

  if (!habit || !(habit in habitConfig)) {
    throw new Error("请使用 --habit sleep 或 --habit mindfulness");
  }

  const targetDate = parseDateParts(args.date);
  const { label, filePath } = habitConfig[habit];
  const dateLabel = formatDateLabel(targetDate);
  const alreadyExists = await updateCheckinFile(filePath, targetDate);

  if (alreadyExists) {
    console.log(`${label}打卡已存在：${dateLabel}`);
    return;
  }

  console.log(`已记录 ${dateLabel} 的${label}打卡`);
}

main().catch((error) => {
  console.error(`打卡更新失败：${error.message}`);
  process.exit(1);
});
