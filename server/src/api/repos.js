import { success, unauthorized, badRequest, logErrAndNext500 } from '../util/http'
import { validRepos, validRepo } from '../util/validations'
import { saveRepos, loadProfile } from '../db'

export async function create ({ body, token }, res, next) {
  try {
    if (!token) { return next(unauthorized()) }
    if (!body || !validRepo(body.repo)) { return next(badRequest()) }

    const { repo } = body
    const { email } = token
    const { repos } = await loadProfile(email)
    if (repos.includes(repo)) { return success(res, repos) }

    const newRepos = await saveRepos(email, [repo].concat(repos))
    success(res, newRepos)
  } catch (err) {
    logErrAndNext500(err, next)
  }
}

export async function remove ({ params, token }, res, next) {
  try {
    if (!token) { return next(unauthorized()) }
    if (!params || !validRepo(params.repo)) { return next(badRequest()) }

    const { repo } = params
    const { email } = token
    const { repos } = await loadProfile(email)
    if (!repos.includes(repo)) { return success(res, repos) }

    const newRepos = await saveRepos(email, repos.filter(r => r !== repo))
    success(res, newRepos)
  } catch (err) {
    logErrAndNext500(err, next)
  }
}
