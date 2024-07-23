<template>
  <AdminSidebar/>
  <div>
     <!-- <div class="widgets-container"
         @dragover.prevent="dragOver"
         @drop.prevent="drop">
      <div v-for="(widget, index) in widgets"
           :key="widget.id"
           class="widget"
           draggable="true"
           @dragstart="dragStart(index, $event)"
           @dragend="dragEnd"
           :class="{ 'dragging': draggedIndex === index }">
        <div class="drag-handle">☰</div>
        <component :is="widget.component"/>
      </div>
    </div>-->
  </div>
  <AdminGrid/>
  <router-view></router-view>
</template>

<script>
import DataViz from '../../components/DataViz.vue';
import AdminSidebar from "../../components/AdminSidebar.vue";
import AdminGrid from "../../components/AdminGrid.vue";

export default {
  components: {
    AdminGrid,
    AdminSidebar,
    DataViz
  },
  data() {
    return {
      widgets: [
        {id: 1, component: 'DataViz'},
        {id: 2, component: 'DataViz'}
      ],
      draggedIndex: -1,
    };
  },
  methods: {
    dragStart(index, event) {
      this.draggedIndex = index;
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('widgetIndex', index);
    },
    dragEnd() {
      this.draggedIndex = -1;
    },
    dragOver(event) {
      event.preventDefault();
    },
    drop(event) {
      const targetIndex = this.getDropTargetIndex(event);
      if (targetIndex !== null && targetIndex !== this.draggedIndex) {
        this.reorderWidgets(this.draggedIndex, targetIndex);
      }
    },
    getDropTargetIndex(event) {
      const containerRect = event.currentTarget.getBoundingClientRect();
      const mousePosition = event.clientY;

      let targetIndex = null;
      for (let i = 0; i < this.widgets.length; i++) {
        const widgetRect = event.currentTarget.children[i].getBoundingClientRect();
        const widgetCenter = widgetRect.top + widgetRect.height / 2;
        if (mousePosition < widgetCenter) {
          targetIndex = i;
          break;
        }
      }
      return targetIndex;
    },
    reorderWidgets(fromIndex, toIndex) {
      const newWidgets = [...this.widgets];
      const [removed] = newWidgets.splice(fromIndex, 1);
      newWidgets.splice(toIndex, 0, removed);
      this.widgets = newWidgets;
    }
  }
};
</script>

<style>
.dragging {
  opacity: 0.5;
}
</style>
