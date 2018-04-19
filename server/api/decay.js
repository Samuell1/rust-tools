import { Router } from 'express'

const router = Router()

const table = {
  twig: {
    hp: 10,
    decayTime: 1
  },
  wood: {
    hp: 250,
    decayTime: 3
  },
  stone: {
    hp: 500,
    decayTime: 5
  },
  metal: {
    hp: 1000,
    decayTime: 8
  },
  armored: {
    hp: 2000,
    decayTime: 12
  }
}

router.get('/decay/:type/:hp', function (req, res, next) {
  const wallType = req.params.type.toLowerCase()

  if (table[wallType] === undefined) {
    res.send(`Type can be only: ${Object.keys(table).join(', ')}`)
  }
  if (isNaN(req.params.hp)) {
    res.send(`Hp can be only number.`)
  }

  const wall = table[wallType]
  const decayRateMinute = (wall.hp / wall.decayTime) / 60
  const time = (req.params.hp / decayRateMinute).toFixed(2)

  const hours = Math.floor(time / 60)
  const minutes = time % 60

  res.send(`${hours ? `${hours} hours` : ``} ${minutes} minutes`)
})

export default router
