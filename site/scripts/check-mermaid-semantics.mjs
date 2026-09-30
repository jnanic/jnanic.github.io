#!/usr/bin/env node

import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const blogDir = path.join(process.cwd(), 'content', 'blog');
const semanticClasses = new Set([
  'source',
  'process',
  'human',
  'failure',
  'warning',
  'approved',
  'evidence',
]);
const allowedClasses = new Set([...semanticClasses, 'layout']);
const optInClasses = new Set(['process', 'human', 'failure', 'warning', 'evidence']);
const expectedShapes = {
  source: new Set(['source']),
  process: new Set(['rectangle']),
  human: new Set(['diamond']),
  failure: new Set(['hexagon']),
  warning: new Set(['hexagon']),
  approved: new Set(['rectangle', 'stadium']),
  evidence: new Set(['evidence']),
};

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getShape(lines, nodeId) {
  const declaration = new RegExp(`^\\s*${escapeRegExp(nodeId)}\\s*(.+)$`);

  for (const line of lines) {
    const match = line.match(declaration);
    if (!match) continue;

    const syntax = match[1].trimStart();
    if (syntax.startsWith('(["')) return 'stadium';
    if (syntax.startsWith('("')) return 'source';
    if (syntax.startsWith('[["')) return 'evidence';
    if (syntax.startsWith('{{"')) return 'hexagon';
    if (syntax.startsWith('{"')) return 'diamond';
    if (syntax.startsWith('["')) return 'rectangle';
  }

  return null;
}

function getTitle(source, index) {
  return source.match(/^\s*accTitle:\s*(.+)$/m)?.[1]?.trim() ?? `diagram ${index + 1}`;
}

function validateBlock(source, context, errors) {
  if (/%%\s*\{\s*init\b/im.test(source)) {
    errors.push(`${context}: diagram-local init directives are not allowed`);
  }
  if (/^\s*classDef\b/im.test(source)) {
    errors.push(`${context}: diagram-local classDef declarations are not allowed`);
  }
  if (/^\s*(?:style|linkStyle)\b.*(?:fill|stroke)\s*:/im.test(source)) {
    errors.push(`${context}: diagram-local fill or stroke declarations are not allowed`);
  }

  const assignments = new Map();
  const classPattern = /^\s*class\s+([\w-]+(?:\s*,\s*[\w-]+)*)\s+(source|process|human|failure|warning|approved|evidence|layout)\s*;?\s*$/gm;

  for (const match of source.matchAll(classPattern)) {
    const role = match[2];
    for (const nodeId of match[1].split(',').map((value) => value.trim())) {
      const previous = assignments.get(nodeId);
      if (previous && previous !== role) {
        errors.push(`${context}: ${nodeId} has conflicting semantic classes ${previous} and ${role}`);
      }
      assignments.set(nodeId, role);
    }
  }

  const optedIn = [...assignments.values()].some((role) => optInClasses.has(role));
  if (!optedIn) return false;

  const lines = source.split(/\r?\n/);
  for (const [nodeId, role] of assignments) {
    if (!allowedClasses.has(role) || role === 'layout') continue;

    const shape = getShape(lines, nodeId);
    if (!shape) {
      errors.push(`${context}: cannot find a quoted node declaration for ${nodeId}`);
      continue;
    }
    if (!expectedShapes[role].has(shape)) {
      errors.push(`${context}: ${nodeId} uses ${shape} with class ${role}`);
    }

    if (role === 'human') {
      const outgoing = lines.filter((line) => new RegExp(`^\\s*${escapeRegExp(nodeId)}\\s*--`).test(line));
      if (outgoing.length > 1 && outgoing.some((line) => !/-->\s*\|[^|]+\|/.test(line))) {
        errors.push(`${context}: human gate ${nodeId} needs labels on every branch`);
      }
    }
  }

  const declaredNodes = new Set();
  const declarationPattern = /^\s*([A-Za-z][\w-]*)\s*(?:\(\["|\("|\[\["|\{\{"|\{"|\[")/gm;
  for (const match of source.matchAll(declarationPattern)) declaredNodes.add(match[1]);
  for (const nodeId of declaredNodes) {
    if (!assignments.has(nodeId)) {
      errors.push(`${context}: ${nodeId} has no semantic class`);
    }
  }

  return true;
}

const files = (await readdir(blogDir))
  .filter((file) => /\.mdx?$/.test(file))
  .sort();
const errors = [];
let diagramCount = 0;
let semanticDiagramCount = 0;

for (const file of files) {
  const markdown = await readFile(path.join(blogDir, file), 'utf8');
  const blocks = [...markdown.matchAll(/```mermaid[^\n]*\n([\s\S]*?)\n```/g)];
  diagramCount += blocks.length;

  blocks.forEach((match, index) => {
    const source = match[1];
    const context = `${file}: ${getTitle(source, index)}`;
    if (validateBlock(source, context, errors)) semanticDiagramCount += 1;
  });
}

if (errors.length) {
  console.error('Mermaid semantic validation failed:');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(
  `Mermaid semantic validation passed for ${semanticDiagramCount} opted-in diagrams `
  + `(${diagramCount} total Mermaid diagrams scanned).`,
);
