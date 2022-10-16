const express = require('express')

class ExpressManager {
  constructor(app) {
    this.app = app
    this.express = express()
    this.router = express.Router()
  }

  initialize() {
    if (!this.app.config.express.enabled) {
      return this.app.log.express('Express disabled in configuration, skipping initialization.')
    }

    this.router.post('/kick', this.kick.bind(this))
    this.router.post('/mute', this.mute.bind(this))
    this.router.post('/unmute', this.unMute.bind(this))
    this.router.post('/promote', this.promote.bind(this))
    this.router.post('/demote', this.demote.bind(this))
    this.router.post('/override', this.override.bind(this))
    this.router.post('/invite', this.invite.bind(this))
    this.router.post('/setrank', this.setRank.bind(this))
    this.router.get('/apinew', this.apiNew.bind(this))
    this.router.get('/keepAlive', this.keepAlive.bind(this))

    this.express.use(express.json(), express.urlencoded({ extended: false }), this.authenticate.bind(this), this.validateBody.bind(this))
    this.express.use('/api', this.router)
    this.express.set('json spaces', 2)

    this.express.listen(this.app.config.express.port, () => {
      this.app.log.express(`API online and is running on http://localhost:${this.app.config.express.port}/api/`)
    })
  }

  async apiNew(request, response) {
    try {
      if (this.app.minecraft.bot?.player) {
        this.app.minecraft.bot.chat('/api new')

        return response.status(200).json({
          success: true
        })
      }

      return response.status(409).json({
        success: false,
        reason: 'Minecraft client is unavailable at this time'
      })
    } catch (error) {
      this.app.log.error(error)

      return response.status(500).json({
        success: false,
        reason: 'An internal server error occurred'
      })
    }
  }

  authenticate(request, response, next) {
        try {
            this.app.log.express(`Incoming request from ${request.ip} to ${request.originalUrl}`)

            next()
        } catch (error) {
            this.app.log.error(error)

            return response.status(500).json({
                success: false,
                reason: 'An internal server error occurred'
            })
        }
    }

  validateBody(request, response, next) {
    try {
      const path = request.path.slice(5)

      switch (path) {
        case 'setrank':
          if (this.missing(['username', 'rank'], request.body)) {
            return response.status(400).json({
              success: false,
              reason: 'Malformed Body'
            })
          }
          next()
          break

        case 'override':
          if (this.missing(['message'], request.body)) {
            return response.status(400).json({
              success: false,
              reason: 'Malformed Body'
            })
          }
          next()
          break

        case 'mute':
          if (this.missing(['username', 'duration'], request.body)) {
            return response.status(400).json({
              success: false,
              reason: 'Malformed Body'
            })
          }
          break

        case 'apinew':
          next()
          break

        case 'keepAlive':
          next()
          break

        default:
          if (this.missing(['username'], request.body)) {
            return response.status(400).json({
              success: false,
              reason: 'Malformed Body'
            })
          }
          next()
      }
    } catch (error) {
      this.app.log.error(error)

      return response.status(500).json({
        success: false,
        reason: 'An internal server error occurred'
      })
    }
  }

  keepAlive(request, response) {
        return response.status(200).json({
            success: true,
            response: 'Still alive'
        })
    }

  missing(array, object) {
    try {
      let missing = false

      array.forEach(element => {
        if (!object[element]) missing = true
      })

      return missing
    } catch (error) {
      return true
    }
  }

  kick(request, response) {
    try {
      if (this.app.minecraft.bot?.player) {
        this.app.minecraft.bot.chat(`/guild kick ${request.body.username} ${request.body.reason ? request.body.reason : 'No reason specified'}`)

        return response.status(200).json({
          success: true
        })
      }

      return response.status(409).json({
        success: false,
        reason: 'Minecraft client is unavailable at this time'
      })
    } catch (error) {
      this.app.log.error(error)

      return response.status(500).json({
        success: false,
        reason: 'An internal server error occurred'
      })
    }
  }

  mute(request, response) {
    try {
      if (this.app.minecraft.bot?.player) {
        this.app.minecraft.bot.chat(`/guild mute ${request.body.username}`)

        return response.status(200).json({
          success: true
        })
      }

      return response.status(409).json({
        success: false,
        reason: 'Minecraft client is unavailable at this time'
      })
    } catch (error) {
      this.app.log.error(error)

      return response.status(500).json({
        success: false,
        reason: 'An internal server error occurred'
      })
    }
  }

  unMute(request, response) {
    try {
      if (this.app.minecraft.bot?.player) {
        this.app.minecraft.bot.chat(`/guild unmute ${request.body.username}`)

        return response.status(200).json({
          success: true
        })
      }

      return response.status(409).json({
        success: false,
        reason: 'Minecraft client is unavailable at this time'
      })
    } catch (error) {
      this.app.log.error(error)

      return response.status(500).json({
        success: false,
        reason: 'An internal server error occurred'
      })
    }
  }

  promote(request, response) {
    try {
      if (this.app.minecraft.bot?.player) {
        this.app.minecraft.bot.chat(`/guild promote ${request.body.username}`)

        return response.status(200).json({
          success: true
        })
      }

      return response.status(409).json({
        success: false,
        reason: 'Minecraft client is unavailable at this time'
      })
    } catch (error) {
      this.app.log.error(error)

      return response.status(500).json({
        success: false,
        reason: 'An internal server error occurred'
      })
    }
  }
  demote(request, response) {
    try {
      if (this.app.minecraft.bot?.player) {
        this.app.minecraft.bot.chat(`/guild demote ${request.body.username}`)

        return response.status(200).json({
          success: true
        })
      }

      return response.status(409).json({
        success: false,
        reason: 'Minecraft client is unavailable at this time'
      })
    } catch (error) {
      this.app.log.error(error)

      return response.status(500).json({
        success: false,
        reason: 'An internal server error occurred'
      })
    }
  }

  override(request, response) {
    try {
      if (this.app.minecraft.bot?.player) {
        this.app.minecraft.bot.chat(request.body.message)

        return response.status(200).json({
          success: true
        })
      }

      return response.status(409).json({
        success: false,
        reason: 'Minecraft client is unavailable at this time'
      })
    } catch (error) {
      this.app.log.error(error)

      return response.status(500).json({
        success: false,
        reason: 'An internal server error occurred'
      })
    }
  }

  invite(request, response) {
    try {
      if (this.app.minecraft.bot?.player) {
        this.app.minecraft.bot.chat(`/guild invite ${request.body.username}`)

        return response.status(200).json({
          success: true
        })
      }

      return response.status(409).json({
        success: false,
        reason: 'Minecraft client is unavailable at this time'
      })
    } catch (error) {
      this.app.log.error(error)

      return response.status(500).json({
        success: false,
        reason: 'An internal server error occurred'
      })
    }
  }

  setRank(request, response) {
    try {
      if (this.app.minecraft.bot?.player) {
        this.app.minecraft.bot.chat(`/guild setrank ${request.body.username} ${request.body.rank}`)
        
        return response.status(200).json({
          success: true
        })
      }

      return response.status(409).json({
        success: false,
        reason: 'Minecraft client is unavailable at this time'
      })
    } catch (error) {
      this.app.log.error(error)

      return response.status(500).json({
        success: false,
        reason: 'An internal server error occurred'
      })
    }
  }
}



module.exports = ExpressManager
