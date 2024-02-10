const reloadTinyMCE = () => {
    const existingScripts = document.querySelectorAll('script[src*="tinymce.min.js"]');
    const newScript = document.createElement('script');
    
    existingScripts.forEach(script => script.remove());
    newScript.src = 'https://cdn.tiny.cloud/1/yqxa1nqsoxr7idi00ug330h0gsh66xcb87j9dbiwzufq336s/tinymce/6/tinymce.min.js';
    newScript.referrerpolicy = 'origin';

    newScript.onload = function () {
        tinymce.init({
            selector: 'textarea',
            apiKey: '{{ TINYMCE_API_KEY }}',
            plugins: 'lists',
            toolbar: 'bullist numlist bold italic underline lignleft aligncenter alignright alignjustify',
        });
    };

    document.head.appendChild(newScript);
}

export {reloadTinyMCE};