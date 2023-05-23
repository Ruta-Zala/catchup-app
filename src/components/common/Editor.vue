<template>
  <quill-editor
    v-model="emailContent"
    :options="editorOption"
    class="customEditor"
    @change="editorContent(emailContent)"
  />
</template>

<script type="ts">
import Quill from 'quill'
import { Component, Vue } from 'vue-property-decorator'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import { quillEditor } from 'vue-quill-editor'

// Generate code-friendly font names
function getFontName(font) {
  return font.toLowerCase().replace(/\s/g, '-')
}

// Specify Quill fonts
const fontList = [
  'Sans serif',
  'Serif',
  'Comic Sans MS',
  'Garamond',
  'Gerogia',
  'Tahoma',
  'Trebuchet MS',
  'Verdana',
]
const fontNames = fontList.map((font) => getFontName(font))
const fonts = Quill.import('formats/font')

fonts.whitelist = fontNames
Quill.register(fonts, true)

// Add fonts to CSS style
let fontStyles = ''

fontList.forEach((font) => {
  const fontName = getFontName(font)

  fontStyles +=
    `.ql-snow .ql-picker.ql-font .ql-picker-label[data-value=${fontName}]::before,
  .ql-snow .ql-picker.ql-font .ql-picker-item[data-value=${fontName}]::before {` +
    `content: '${font}';` +
    `font-family: '${font}', sans-serif;` +
    `}` +
    `.ql-font-${fontName}{` +
    ` font-family: '${font}', sans-serif;` +
    `}`
})

const node = document.createElement('style')

node.innerHTML = fontStyles
document.body.appendChild(node)

const fontSizeArr = ['8px', '10px', '12px', '14px', '18px', '24px', '36px']

const Size = Quill.import('attributors/style/size')

Size.whitelist = fontSizeArr
Quill.register(Size, true)
@Component({
  components: {
    quillEditor,
  },
})
export default class Editor extends Vue {
  data() {
    return {
      editorOption: {
        modules: {
          toolbar: [
            [
              { font: fonts.whitelist },
              { size: Size.whitelist },
              'bold',
              'italic',
              'underline',
              { color: [] },
              { list: 'ordered' },
              { list: 'bullet' },
              { align: [] },
              'blockquote',
              'image',
              'clean',
            ],
            ['code', 'link'],
          ],
        },
      },
      emailContent: '',
    }
  }

  get getEmailContent() {
    return this.$store.getters.getEmailContent
  }

  editorContent(emailContent) {
    const att = document.createAttribute('spellCheck')

    att.value = 'false'
    document.getElementsByClassName('ql-editor')[0].setAttributeNode(att)
    this.$store.commit('editorContent', emailContent )
  }
}
</script>

<style lang="scss">
.customEditor {
  position: relative;
  height: 100%;

  .ql-snow {
    &.ql-container {
      border: none;
      font-family: 'Montserrat', sans-serif;

      .ql-editor {
        &.ql-blank::before {
          @include themify {
            color: themed('fontColor');
          }
        }
      }
    }

    &.ql-toolbar {
      position: absolute;
      bottom: 0;
      z-index: 12;
      right: 10px;
      margin: 10px;
      font-family: 'Montserrat', sans-serif;
      border: none;
      box-shadow: none;

      .ql-formats {
        margin-right: 0;
        display: none;

        &:first-child {
          padding: 10px;
          border: 1px solid $borderColorBase;
          background: #ffff;
          box-shadow: 0 0 11px rgb(98 161 251 / 33%);
          border-radius: 6px;
        }

        &:last-child {
          display: block;
        }
      }

      button,
      .ql-picker {
        text-decoration: inherit;
        outline: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
        border-radius: 6px;
        min-height: 36px;
        min-width: 36px;
        margin: 3px;

        .ql-stroke {
          stroke: $fontColorBase;
        }

        &:hover,
        &.ql-active {
          background: $backgroundColorSlim;

          .ql-stroke {
            stroke: $fontColorBlue;
          }
        }

        svg {
          height: 18px;
        }
      }

      .ql-code,
      .ql-link {
        position: absolute;
        bottom: -63px;
        right: 215px;
        z-index: 61;

        .ql-stroke {
          stroke: $fontColorBase;
          @include themify {
            stroke: themed(fontColor);
          }
        }

        &:hover {
          @include themify {
            background: themed('backgroundColor');
          }
        }
      }

      .ql-link {
        right: 257px;
      }

      .ql-picker-label {
        align-items: center;
        display: flex;
      }

      .ql-picker.ql-expanded .ql-picker-label {
        border-color: transparent;
        box-shadow: 0 5px 10px rgb(98 161 251 / 24%);
        border-radius: 6px;
        color: $fontColorBlue;
      }
    }

    .ql-picker {
      &.ql-expanded {
        .ql-picker-options {
          bottom: 32px;
          top: unset;
          background-color: $whiteColor;
          box-shadow: 0 10px 25px rgb(98 161 251 / 33%);
          border: transparent;
          border-radius: 6px;
          padding: 0;
          list-style: none;
          overflow: hidden;
        }
      }

      &-item {
        display: list-item;
        user-select: none;
        margin: 0;
        background: $whiteColor;
        border-top: 1px solid $borderColorBase;
        padding: 13px 15px 13px 15px;
        font-weight: 500;
        font-size: 12px;
        white-space: nowrap;

        &:hover {
          background: $backgroundColorSlim;
          font-weight: 700;
          color: $fontColorBase;
        }
      }

      &.ql-color-picker .ql-picker-options {
        width: 128px;
      }

      &.ql-icon-picker .ql-picker-item {
        height: 44px;
        width: 44px;
      }

      &.ql-color,
      &.ql-align {
        .ql-picker-label {
          justify-content: center;
        }
      }
    }
  }

  &.hiddenToolbar {
    .ql-snow {
      &.ql-toolbar {
        .ql-formats {
          display: block;
        }
      }
    }
  }
}

//Editor custom style
.ql-snow {
  .ql-picker {
    &.ql-size {
      width: 68px;

      .ql-picker-label,
      .ql-picker-item {
        &::before {
          content: attr(data-value) !important;
        }
      }
    }
  }

  u {
    text-decoration: underline;
  }
}
</style>
