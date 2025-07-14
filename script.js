document.addEventListener('DOMContentLoaded', () => {
    const downloadForm = document.getElementById('downloadForm');
    const videoUrlInput = document.getElementById('videoUrl');
    const downloadBtn = document.getElementById('downloadBtn');
    const btnText = document.querySelector('.btn-text');
    const loader = document.querySelector('.loader');
    const resultDiv = document.getElementById('result');
    const errorDiv = document.getElementById('error');
    const thumbnailImg = document.getElementById('thumbnail');
    const videoTitle = document.getElementById('videoTitle');
    const downloadLinksDiv = document.getElementById('downloadLinks');

    downloadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const videoUrl = videoUrlInput.value.trim();

        // Simple URL validation. For more robust validation, a library might be used. [11, 13]
        if (!isValidUrl(videoUrl)) {
            showError('Please enter a valid video URL.');
            return;
        }

        // Show loader and disable button
        setLoading(true);
        hideError();
        resultDiv.style.display = 'none';

        try {
            // !!! IMPORTANT !!!
            // Replace this placeholder URL with a real, working video downloader API endpoint.
            // You can find various APIs online, both free and paid.
            const apiEndpoint = `https://api.example-downloader.com/video?url=${encodeURIComponent(videoUrl)}`;
            
            // This is a mock fetch call. In a real scenario, this would fetch from a live API.
            const response = await mockFetch(apiEndpoint, videoUrl);
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Could not fetch video information.');
            }

            const data = await response.json();
            displayResults(data);

        } catch (err) {
            showError(err.message || 'An unexpected error occurred.');
        } finally {
            // Hide loader and enable button
            setLoading(false);
        }
    });
    
    /**
     * Toggles the loading state of the download button.
     * @param {boolean} isLoading - Whether to show the loader.
     */
    function setLoading(isLoading) {
        if (isLoading) {
            btnText.style.display = 'none';
            loader.style.display = 'block';
            downloadBtn.disabled = true;
        } else {
            btnText.style.display = 'block';
            loader.style.display = 'none';
            downloadBtn.disabled = false;
        }
    }

    /**
     * Displays the video information and download links.
     * @param {object} data - The data object from the API.
     */
    function displayResults(data) {
        thumbnailImg.src = data.thumbnail;
        videoTitle.textContent = data.title;
        downloadLinksDiv.innerHTML = ''; // Clear previous links

        if (data.formats && data.formats.length > 0) {
            data.formats.forEach(format => {
                const link = document.createElement('a');
                link.href = format.url;
                link.textContent = `${format.quality} (${format.format.toUpperCase()})`;
                link.className = 'download-link';
                link.target = '_blank'; // Open in new tab
                link.download = ''; // Suggests to browser to download
                downloadLinksDiv.appendChild(link);
            });
        }

        resultDiv.style.display = 'block';
    }

    /**
     * Displays an error message.
     * @param {string} message - The error message to display.
     */
    function showError(message) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    }

    /**
     * Hides the error message.
     */
    function hideError() {
        errorDiv.style.display = 'none';
    }
    
    /**
     * Validates a URL string.
     * @param {string} string - The URL to validate.
     * @returns {boolean} - True if the URL is valid, false otherwise.
     */
    function isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }
    
    /**
     * MOCK FETCH FUNCTION
     * This function simulates an API call for demonstration purposes.
     * Replace this with a real `fetch` call to your chosen API.
     * @param {string} endpoint - The API endpoint.
     * @param {string} videoUrl - The user-provided video URL.
     * @returns {Promise} - A promise that resolves with a mock response.
     */
    function mockFetch(endpoint, videoUrl) {
        console.log(`Mock fetching from: ${endpoint}`);
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate a successful response for a known "magic" URL
                if (videoUrl.includes("youtube.com")) {
                    resolve({
                        ok: true,
                        json: () => Promise.resolve({
                            title: "Sample Video Title From YouTube",
                            thumbnail: "https://via.placeholder.com/150/771796/FFFFFF?Text=Video+Thumbnail",
                            formats: [
                                { quality: '1080p', format: 'mp4', url: '#' },
                                { quality: '720p', format: 'mp4', url: '#' },
                                { quality: '480p', format: 'mp4', url: '#' },
                                { quality: 'Audio', format: 'mp3', url: '#' }
                            ]
                        })
                    });
                } else {
                    // Simulate an error response
                    reject(new Error("This is a mock error. Use a real API for functionality."));
                }
            }, 1500); // Simulate network delay
        });
    }
});
