Vue.component('modal', {
  template: `
      <transition name="modal">
        <div class="modal-mask">
          <div class="modal-wrapper">
            <div class="modal-container">

              <div class="modal-header">
                <slot name="header">
                  default header
                </slot>
              </div>

              <div class="modal-body">
                <slot name="body">
                  default body
                </slot>
              </div>

              <div class="modal-footer">
                <slot name="footer">
                  <input class="btn btn-info" type="button" :value="$t('message.save')"  @click="$emit('save')" />&nbsp;&nbsp;&nbsp;&nbsp;
                  <input class="btn btn-warning" type="button" :value="$t('message.return')" @click="$emit('close')" />
                </slot>
              </div>
            </div>
          </div>
        </div>
      </transition>
  `
})
