<template>
  <div>
    <div class="editor mb-4 p-4 bg-white border border-gray-300 rounded shadow-sm">
      <editor-content :editor="editor"/>
    </div>
    <button @click="saveContent" class="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
      Sauvegarder
    </button>
  </div>
</template>

<script setup>
import {ref, watch} from 'vue';
import axios from 'axios';
import {useEditor, EditorContent} from '@tiptap/vue-3'
import Highlight from '@tiptap/extension-highlight'
import Typography from '@tiptap/extension-typography'
import StarterKit from '@tiptap/starter-kit'
import HardBreak from '@tiptap/extension-hard-break'

const props = defineProps({
  initialContent: String,
  documentType: String,
  documentId: String
});

const editor = useEditor({
      extensions: [
        StarterKit,
        Highlight,
        Typography,
        HardBreak
      ],
      content: props.initialContent || '',
    })
;

const saveContent = async () => {
  if (editor.value) {
    try {
      const content = editor.value.getHTML();
      await axios.patch(`${import.meta.env.VITE_API_ENDPOINT}:3000/legals/${props.documentId}`, {content}, {withCredentials: true});
      alert('Contenu sauvegardé avec succès!');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde :', error);
      alert('Erreur lors de la sauvegarde du document.');
    }
  }
};

watch(() => props.initialContent, (newContent) => {
  if (editor.value && newContent) {
    editor.value.commands.setContent(newContent);
  }
});

</script>

<style>
.editor {
  border: 1px solid #ccc;
  min-height: 400px;
  padding: 10px;
}
</style>
