import { ProblemDocument } from 'http-problem-details'

export const fromObject = (object: any): ProblemDocument => {
  const { status, title, detail, type, instance } = object
  return new ProblemDocument({
    status,
    title,
    detail,
    type,
    instance
  })
}

export const fromJSON = (json: string): ProblemDocument =>
  fromObject(JSON.parse(json))
