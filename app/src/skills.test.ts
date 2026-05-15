import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'

const codexSkillsDir = path.resolve(__dirname, '../../.codex/skills')
const forbiddenCodexFrontmatterFields = new Set([
  'allowed-tools',
  'argument-hint',
  'context',
  'agent',
])

function skillDirs(root: string) {
  return fs.readdirSync(root).filter((f) =>
    fs.statSync(path.join(root, f)).isDirectory(),
  )
}

function frontmatter(content: string) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n/)
  expect(match, 'missing YAML frontmatter').not.toBeNull()
  const entries = new Map<string, string>()
  for (const line of match?.[1].split('\n') ?? []) {
    const field = line.match(/^([a-zA-Z0-9_-]+):\s*(.*)$/)
    if (field) entries.set(field[1], field[2])
  }
  return entries
}

describe('Codex skills', () => {
  it('Codex skills directory exists and contains skill subdirectories', () => {
    expect(fs.existsSync(codexSkillsDir)).toBe(true)
    expect(skillDirs(codexSkillsDir).length).toBeGreaterThan(0)
  })

  it('each Codex skill has only Codex-compatible required frontmatter and instructions', () => {
    for (const dir of skillDirs(codexSkillsDir)) {
      const skillFile = path.join(codexSkillsDir, dir, 'SKILL.md')
      expect(fs.existsSync(skillFile), `${dir}/SKILL.md missing`).toBe(true)
      const content = fs.readFileSync(skillFile, 'utf-8')
      const fields = frontmatter(content)

      expect(fields.get('name'), `${dir}: missing name frontmatter`).toBe(dir)
      expect(fields.get('description'), `${dir}: missing description frontmatter`).toBeTruthy()
      for (const forbidden of forbiddenCodexFrontmatterFields) {
        expect(fields.has(forbidden), `${dir}: contains Claude-only frontmatter ${forbidden}`).toBe(false)
      }

      expect(/^# .+/m.test(content), `${dir}: missing # title`).toBe(true)
      expect(/^## Instructions/m.test(content), `${dir}: missing ## Instructions`).toBe(true)
    }
  })
})
