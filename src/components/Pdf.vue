<template>
  <v-container>
    <v-card class="mx-auto" max-width="800px"> 
      <v-card-title class="headline">PDF Preview</v-card-title>
      <v-card-subtitle v-if="showPdfPreview">
        <iframe :src="pdfUrl || placeholderPdfUrl" width="100%" height="800px" style="border: none;" @error="onIframeError"></iframe>
      </v-card-subtitle>
      <v-card-actions>
        <v-btn @click="saveAsWord" color="primary" v-if="showPdfPreview">Save to Word</v-btn>
        <v-btn @click="saveAsPdf" color="secondary" v-if="showPdfPreview">Save to PDF</v-btn>
        <v-btn @click="closePreview" color="secondary" v-if="showPdfPreview">Close</v-btn>
        <v-btn @click="openPreview" color="primary" v-else>Open Preview</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'PdfPreview',
  setup() {
    const pdfUrl = ref(null);
    const showPdfPreview = ref(false); // Set to false initially

    const fetchPdfUrl = async () => {
      try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbzliu5roOnl4bRHpRXSFh3MMH64QZtPSdzRBcef4Mj_NM9yB3OjmVCTonmbUzPMaZHW/exec');
        const data = await response.json();
        pdfUrl.value = data.pdfUrl;
       
      } catch (error) {
        console.error('Error fetching PDF URL:', error);
      }
    };

    const saveAsWord = async () => {
      try {
        const response = await fetch("https://script.google.com/macros/s/AKfycbzebCuUZfMZ9RRJRaC_A6NRQZgCMzfyu56B4LwEGZUeSKAPuEu8jGOmg5ODRnqkG_nb/exec");
        const data = await response.json();

        if (response.ok) {
          // Directly download the Word document
          const link = document.createElement('a');
          link.href = data.wordUrl;
          link.download = 'document.docx';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          console.error('Failed to generate document:', data.error);
        }
      } catch (error) {
        console.error('Error fetching Word document:', error);
      }
    };

    const getDownloadUrl = (url) => {
      const fileId = url.match(/\/d\/(.*?)\//)[1];
      return `https://drive.google.com/uc?export=download&id=${fileId}`;
    };
    const saveAsPdf= () => {
      const downloadUrl = getDownloadUrl(pdfUrl.value);
      window.location.href = downloadUrl; // Redirect to download URL
    };

    const closePreview = () => {
      showPdfPreview.value = false;
    };

    const openPreview = () => {
      showPdfPreview.value = true;
    };

    // Fetch PDF URL when the component is mounted
    fetchPdfUrl();

    return {
      pdfUrl,
      showPdfPreview,
      saveAsWord,
      saveAsPdf,
      closePreview,
      openPreview
    };
  }
};
</script>

<style scoped>
/* Add any additional styling if needed */
</style>
