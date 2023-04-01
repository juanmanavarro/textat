<template>
  <li
    class="list-group-item d-flex justify-content-between align-items-center cursor-pointer"
    style="height:47px"
    @mouseenter="showActions = true"
    @mouseleave="showActions = false"
    @click="postStore.fetch({ force: true, category: category.id })"
    :class="{ active: isActive }"
  >
    <div class="d-flex">
      <span>{{ category.emoji }}</span>
      <span class="ms-2">({{ category.post_count }})</span>
      <span style="max-width:120px" v-if="!isEditing" class="ms-2 text-ellipsis">
        {{ category.name || '-' }}
      </span>
    </div>
    <div
      v-if="isEditing"
      class="input-group input-group-sm ms-2"
    >
      <input
        type="text"
        class="form-control border-end-0"
        v-model="editedCategory.name"
        @keyup.enter="edit"
        @blur="edit"
        ref="editInput"
      >
      <button
        class="btn btn-outline-secondary border border-start-0"
        type="button"
        id="button-addon2"
        style="border-color:#ced4da!important"
        @click.stop="edit"
      >
        <i class="bi bi-x"></i>
      </button>
    </div>
    <div v-if="!isEditing && showActions && !isActive">
      <a class="link" @click.stop="openEdit"><i class="bi bi-pencil"></i></a>
      <a class="ms-2 link-danger" @click="remove"><i class="bi bi-trash2"></i></a>
    </div>
  </li>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue';
import { useCategoryStore } from '@/stores/category';
import { usePostStore } from '@/stores/post';
import { useConfirm } from "primevue/useconfirm";

const confirm       = useConfirm();
const categoryStore = useCategoryStore();
const postStore     = usePostStore();

const props = defineProps({
  category: Object,
  isActive: Boolean,
});

const isEditing = ref(false);
const showActions = ref(false);
const editInput = ref();
const editedCategory = ref({ name: props.category.name });

const openEdit = async () => {
  isEditing.value = true;
  await nextTick()
  editInput.value.focus();
};

const edit = async () => {
  const edited = await categoryStore.edit({
    ...props.category,
    name: editedCategory.value.name,
  });
  if ( edited ) {
    isEditing.value = false;
    return;
  }
};

const cancelEdit = () => {
  isEditing.value = false;
  editedCategory.value.name = props.category.name;
};

const remove = async (e) => {
  e.stopPropagation();
  confirm.require({
    target: e.currentTarget,
    message: 'Eliminar la categoría?',
    description: 'Esto no se puede deshacer',
    icon: 'pi pi-info-circle',
    acceptClass: 'p-button-danger',
    acceptLabel: 'Eliminar',
    rejectLabel: 'Cancelar',
    accept: async () => {
      const removed = await categoryStore.remove(props.category);
      if ( removed ) {
        isEditing.value = false;
        return;
      }
    },
  });
};

onMounted(() => {
  // editInput.value.on('blur', () => console.log('asdf'))
});
</script>
