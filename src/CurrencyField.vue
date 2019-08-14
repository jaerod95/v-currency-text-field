<template>
  <v-text-field
    :id="identifier"
    ref="textField"
    v-model="response"
    :autofocus="autofocus"
    :class="['sel_currency_' + identifier, classes, 'test-child']"
    :error-messages="errorMessages"
    :hint="hint"
    :aria-label="title"
    :label="title"
    :name="identifier"
    :placeholder="placeholder || 'Your answer'"
    :required="required"
    :disabled="disabled"
    type="tel"
    inputmode="decimal"
    pattern="[0-9]*"
    @blur="formatCurrency(true);$emit('blur')"
    @focus="$emit('focus')"
    @keyup="formatCurrency();$emit('keyup')"
  />
</template>

<script>
import usCurrencyFilter from './usCurrencyFilter'

export default {
  name: 'SnCurrencyInput',
  filters: {
    usCurrencyFilter
  },
  props: {
    autofocus: {
      type: Boolean,
      default: false,
      required: false
    },
    classes: {
      type: String,
      default: '',
      required: false
    },
    disabled: {
      type: Boolean,
      default: false,
      required: false
    },
    emitNumber: {
      type: Boolean,
      default: false,
      required: false
    },
    errorMessages: {
      type: String,
      default: '',
      required: false
    },
    hint: {
      type: String,
      default: '',
      required: false
    },
    identifier: {
      type: String,
      default: '',
      required: false
    },
    placeholder: {
      type: String,
      default: '',
      required: false
    },
    required: {
      type: Boolean,
      default: false,
      required: false
    },
    title: {
      type: String,
      default: '',
      requried: false
    },
    value: {
      type: [String, Number],
      default: '',
      required: false
    }
  },

  data () {
    return {
      response: null,
      lastInput: null,
      startPos: 0,
      startLen: 0,
      endPos: 0,
      endLen: 0
    }
  },

  watch: {
    response (newVal) {
      const emitVal = this.emitNumber ? this.toNumber(newVal) : newVal
      this.$emit('input', emitVal)
    },
    value (newVal) {
      if (newVal === this.response) {
        return
      }
      this.response = newVal
      this.formatCurrency()
    }
  },

  created () {
    this.response = this.value
    this.formatCurrency()
  },

  methods: {
    formatCurrency (forceFormatting = false) {
      try {
        let textField = this.$refs.textField.$el.querySelector('input')
        this.startPos = textField.selectionStart
        this.startLen = textField.value.length
      } catch {}

      this.lastInput = this.response
      this.response = usCurrencyFilter(this.formatStringToDecimals(this.response), false, forceFormatting)
      try {
        let textField = this.$refs.textField.$el.querySelector('input')
        this.endPos = textField.selectionStart
        this.endLen = textField.value.length
        if (this.startPos === this.startLen && this.startPos === this.endPos && this.startPos === this.endLen) {
          this.textField.selectionStart = this.startLen
          this.textField.selectionEnd = this.startLen
          this.startPos = this.startLen
        } else {
          this.$nextTick(() => {
            this.endPos = textField.selectionStart
            this.endLen = textField.value.length
            this.replaceCursorToCorrectLocation()
          })
        }
      } catch {}
    },
    replaceCursorToCorrectLocation () {
      try {
        let textField = this.$refs.textField.$el.querySelector('input')
        let tempStart = JSON.parse(JSON.stringify(this.startPos))
        if (this.tempStart !== this.endPos) {
          if (this.startLen + 1 === this.endLen) {
            tempStart += 1
          } else if (this.startLen - 1 === this.endLen) {
            tempStart -= 1
          }
          textField.selectionStart = tempStart
          textField.selectionEnd = tempStart
        }
      } catch {}
    },
    formatStringToDecimals (num) {
      let numb = String(num)
      numb = numb.replace(/[^0-9.]/g, '')
      if (numb === '') {
        return null
      }
      let firstDecimalIndex = numb.indexOf('.')
      if (firstDecimalIndex === -1) {
        return numb
      } else if (numb.length === 1) {
        return '.'
      } else {
        let fixedPostDecimalString = numb.substring(firstDecimalIndex + 1, numb.length).replace(/\./g, '')
        numb = numb.slice(0, firstDecimalIndex + 1) + fixedPostDecimalString
        let decimalString = String(Number(numb).toFixed(Math.min(2, fixedPostDecimalString.length)))
        if (numb.substring(0, numb.length - 1) === decimalString) {
          return numb
        }
        return decimalString
      }
    },
    toNumber (num) {
      const check = new RegExp(/[$]|[,]/g)
      const stripped = num.replace(check, '')
      return Number(stripped)
    }
  }

}
</script>
