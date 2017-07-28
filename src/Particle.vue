<script>
  export default {
    name: 'Particle',

    render () { },

    props: {
      stackPos: Number,
      positionX: Number,
      positionY: Number,
      radius: Number
    },

    data () {
      return {
        layer: Math.ceil(Math.random() * 3),
        parallaxTargX: 0,
        parallaxTargY: 0,
        parallaxOffsetX: 0,
        parallaxOffsetY: 0,
        speedX: 0,
        speedY: 0
      }
    },

    computed: {
      orientationSupport () {
        return this.$parent.orientationSupport
      },

      desktop () {
        return this.$parent.desktop
      },

      wrapW () {
        return this.$parent.width
      },

      wrapH () {
        return this.$parent.height
      },

      parallax () {
        return this.$parent.parallax
      },

      directionX () {
        return this.$parent.directionX
      },

      directionY () {
        return this.$parent.directionY
      },

      minSpeedX () {
        return this.$parent.minSpeedX
      },
      maxSpeedX () {
        return this.$parent.maxSpeedX
      },
      minSpeedY () {
        return this.$parent.minSpeedY
      },
      maxSpeedY () {
        return this.$parent.maxSpeedY
      },

      maxRadius () {
        return this.$parent.maxRadius
      },

      minRadius () {
        return this.$parent.minRadius
      },

      parallaxMultiplier () {
        return this.$parent.parallaxMultiplier
      },

      pointerX () {
        return this.$parent.pointerX
      },

      pointerY () {
        return this.$parent.pointerY
      }
    },

    created () {
      this.initPosition()
      this.initSpeed()
      this.initRadius()
    },

    methods: {
      initPosition () {
        this.$emit('update:positionX', Math.ceil(Math.random() * this.wrapW))
        this.$emit('update:positionY', Math.ceil(Math.random() * this.wrapH))
      },

      initSpeed () {
        switch (this.directionX) {
          case 'left':
            this.speedX = +(-this.maxSpeedX + (Math.random() * this.maxSpeedX) - this.minSpeedX).toFixed(2)
            break
          case 'right':
            this.speedX = +((Math.random() * this.maxSpeedX) + this.minSpeedX).toFixed(2)
            break
          default:
            this.speedX = +((-this.maxSpeedX / 2) + (Math.random() * this.maxSpeedX)).toFixed(2)
            this.speedX += this.speedX > 0 ? this.minSpeedX : -this.minSpeedX
            break
        }

        switch (this.directionY) {
          case 'up':
            this.speedY = +(-this.maxSpeedY + (Math.random() * this.maxSpeedY) - this.minSpeedY).toFixed(2)
            break
          case 'down':
            this.speedY = +((Math.random() * this.maxSpeedY) + this.minSpeedY).toFixed(2)
            break
          default:
            this.speedY = +((-this.maxSpeedY / 2) + (Math.random() * this.maxSpeedY)).toFixed(2)
            this.speedY += this.speedY > 0 ? this.minSpeedY : -this.minSpeedY
            break
        }
      },

      initRadius () {
        this.$emit('update:radius', Math.ceil(this.minRadius + Math.random() * (this.maxRadius - this.minRadius)))
      },

      updatePosition () {
        let positionX = this.positionX
        let positionY = this.positionY
        if (this.parallax) {
          // Calculate parallax offsets
          this.parallaxTargX = (this.pointerX - (this.wrapW / 2)) / (this.parallaxMultiplier * this.layer)
          this.parallaxOffsetX += (this.parallaxTargX - this.parallaxOffsetX) / 10 // Easing equation
          this.parallaxTargY = (this.pointerY - (this.wrapH / 2)) / (this.parallaxMultiplier * this.layer)
          this.parallaxOffsetY += (this.parallaxTargY - this.parallaxOffsetY) / 10 // Easing equation
        }

        switch (this.directionX) {
          case 'left':
            if (this.positionX + this.speedX + this.parallaxOffsetX < 0) {
              positionX = this.wrapW - this.parallaxOffsetX
            }
            break
          case 'right':
            if (this.positionX + this.speedX + this.parallaxOffsetX > this.wrapW) {
              positionX = 0 - this.parallaxOffsetX
            }
            break
          default:
            if (this.positionX + this.speedX + this.parallaxOffsetX > this.wrapW || this.positionX + this.speedX + this.parallaxOffsetX < 0) {
              this.speedX = -this.speedX
            }
            break
        }

        switch (this.directionY) {
          case 'up':
            if (this.positionY + this.speedY + this.parallaxOffsetY < 0) {
              positionY = this.wrapH - this.parallaxOffsetY
            }
            break
          case 'down':
            if (this.positionY + this.speedY + this.parallaxOffsetY > this.wrapH) {
              positionY = 0 - this.parallaxOffsetY
            }
            break
          default:
            // If particle has reached edge of canvas, reverse its direction
            if (this.positionY + this.speedY + this.parallaxOffsetY > this.wrapH || this.positionY + this.speedY + this.parallaxOffsetY < 0) {
              this.speedY = -this.speedY
            }
            break
        }

        this.$emit('update:positionX', positionX + this.speedX)
        this.$emit('update:positionY', positionY + this.speedY)
      }
    }
  }
</script>
