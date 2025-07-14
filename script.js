document.addEventListener('DOMContentLoaded', () => {
    const videoUrlInput = document.getElementById('videoUrlInput');
    const downloadButton = document.getElementById('downloadButton');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const errorMessage = document.getElementById('errorMessage');
    const downloadOptionsSection = document.getElementById('downloadOptions');
    const videoThumbnail = document.getElementById('videoThumbnail');
    const videoTitle = document.getElementById('videoTitle');
    const formatList = document.querySelector('.format-list');

    downloadButton.addEventListener('click', async () => {
        const videoUrl = videoUrlInput.value.trim();
        if (!videoUrl) {
            displayMessage('Please enter a video URL.', 'error');
            return;
        }

        resetUI();
        showLoading(true);

        try {
            // In a real application, this would be an API call to your backend
            // Example: const response = await fetch('/api/get_video_info', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ url: videoUrl })
            // });
            // const data = await response.json();

            // Mock data for demonstration
            const mockData = await simulateBackendResponse(videoUrl);

            if (mockData.error) {
                displayMessage(mockData.error, 'error');
                return;
            }

            videoThumbnail.src = mockData.thumbnail;
            videoTitle.textContent = mockData.title;
            formatList.innerHTML = ''; // Clear previous formats

            mockData.formats.forEach(format => {
                const formatItem = document.createElement('div');
                formatItem.classList.add('format-item');
                formatItem.innerHTML = `
                    <p>Format: <strong>${format.format}</strong></p>
                    <p>Quality: ${format.quality}</p>
                    <p>Size: ${format.size}</p>
                    <button data-url="${mockData.download_base_url}?format_id=${format.id}">Download ${format.quality}</button>
                `;
                formatList.appendChild(formatItem);
            });

            downloadOptionsSection.style.display = 'block';

        } catch (error) {
            console.error('Error:', error);
            displayMessage('An unexpected error occurred. Please try again.', 'error');
        } finally {
            showLoading(false);
        }
    });

    // Event delegation for download buttons within the format list
    formatList.addEventListener('click', (event) => {
        if (event.target.tagName === 'BUTTON' && event.target.hasAttribute('data-url')) {
            const downloadLink = event.target.getAttribute('data-url');
            // In a real application, you might redirect or trigger a file download
            // For security and backend control, the actual download should happen via backend
            window.open(downloadLink, '_blank'); // Opens in a new tab/window
            displayMessage('Your download should start shortly!', 'success');
        }
    });

    function showLoading(isLoading) {
        loadingSpinner.style.display = isLoading ? 'block' : 'none';
        downloadButton.disabled = isLoading;
        videoUrlInput.disabled = isLoading;
    }

    function displayMessage(message, type) {
        errorMessage.textContent = message;
        errorMessage.className = `error-message ${type === 'success' ? 'success-message' : 'error-message'}`;
        errorMessage.style.display = 'block';
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 5000); // Hide after 5 seconds
    }

    function resetUI() {
        errorMessage.style.display = 'none';
        downloadOptionsSection.style.display = 'none';
        videoThumbnail.src = '';
        videoTitle.textContent = '';
        formatList.innerHTML = '';
    }

    // Simulate backend response for demonstration
    async function simulateBackendResponse(url) {
        return new Promise(resolve => {
            setTimeout(() => {
                if (url.includes('youtube.com')) {
                    resolve({
                        thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hq720.jpg',
                        title: 'Rick Astley - Never Gonna Give You Up (Official Music Video)',
                        formats: [
                            { id: '137', format: 'mp4', quality: '1080p', size: '20MB' },
                            { id: '136', format: 'mp4', quality: '720p', size: '10MB' },
                            { id: '18', format: 'mp4', quality: '360p', size: '5MB' },
                            { id: '251', format: 'webm', quality: 'audio only', size: '2MB' }
                        ],
                        download_base_url: '/api/download_video'
                    });
                } else if (url.includes('tiktok.com')) {
                    resolve({
                        thumbnail: 'https://p16-sign-va.tiktokcdn.com/obj/tos-maliva-avt-0068/3b67e7c805a8d9a2a9d8d6d8f5d8f6d8~c5_720x720.jpeg',
                        title: 'Funny TikTok Dance Compilation',
                        formats: [
                            { id: 'tiktok_hd', format: 'mp4', quality: 'HD', size: '15MB' },
                            { id: 'tiktok_sd', format: 'mp4', quality: 'SD', size: '8MB' }
                        ],
                        download_base_url: '/api/download_video'
                    });
                } else if (url.includes('instagram.com')) {
                     resolve({
                        thumbnail: 'https://instagram.fgoi1-2.fna.fbcdn.net/v/t51.2885-15/e35/123456789_123456789_123456789_n.jpg?_nc_ht=instagram.fgoi1-2.fna.fbcdn.net&_nc_cat=1&_nc_ohc=abcdefg&ccb=7-5&oh=0123456789abcdef&oe=123456789&_nc_sid=abcdef',
                        title: 'Beautiful Instagram Reel',
                        formats: [
                            { id: 'instagram_1080p', format: 'mp4', quality: '1080p', size: '12MB' },
                            { id: 'instagram_720p', format: 'mp4', quality: '720p', size: '7MB' }
                        ],
                        download_base_url: '/api/download_video'
                    });
                } else {
                    resolve({ error: 'Unsupported URL or video not found.' });
                }
            }, 1500); // Simulate network delay
        });
    }
});
