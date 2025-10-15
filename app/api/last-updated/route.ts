import { NextResponse } from 'next/server'
import { execSync } from 'child_process'

export async function GET() {
  try {
    // Get the last commit date
    const lastCommitDate = execSync('git log -1 --format=%cd --date=iso')
      .toString()
      .trim()

    const date = new Date(lastCommitDate)
    const formatted = date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })

    return NextResponse.json({
      lastUpdated: formatted,
      timestamp: date.toISOString(),
    })
  } catch (error) {
    console.error('Error fetching git info:', error)
    const now = new Date()
    return NextResponse.json({
      lastUpdated: now.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
      timestamp: now.toISOString(),
    })
  }
}
