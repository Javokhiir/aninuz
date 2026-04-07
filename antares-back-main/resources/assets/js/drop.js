class DnD {
    config = {
        inputElem: "#file",
        previewContainer: "#fileList",
        dropContainer: "#dropArea",
        btnClass: '.btn-form',
        inputName: 'image',
        csrf: false,
        allowedTypes: ["image/jpeg", "image/png", "image/webp"],
    };
    input = document.querySelector(this.config.inputElem);
    fileList = document.querySelector(this.config.previewContainer);
    dropArea = document.querySelector(this.config.dropContainer);
    btn = document.querySelector(this.config.btnClass)
    files = [];

    constructor(formContainer, config) {
        this.dropForm = document.querySelector(formContainer);
        this.config = config ? Object.assign({}, this.config, config) : this.config;
        if (this.dropForm && this.dropForm.classList.contains(formContainer.replace('.', ''))) {
            this.dropFile();
            this.fileInput();
            this.submit();
        }
    }

    dropFile() {
        this.dropArea.addEventListener("dragover", (e) => {
            e.preventDefault();
            this.dropArea.classList.add("highlight");
        });

        this.dropArea.addEventListener("dragleave", (e) => {
            e.preventDefault();
            this.dropArea.classList.remove("highlight");
        });

        this.dropArea.addEventListener("drop", (e) => {
            e.preventDefault();
            this.dropArea.classList.remove("highlight");
            this.handleFiles(e.dataTransfer.files);
        })
    }

    fileInput() {
        this.input.addEventListener("change", (e) => {
            this.handleFiles(e.target.files);
        })
    }

    handleFiles(files) {
        this.files = files;
        this.fileList.innerHTML = "";
        [...files].forEach(file => {
            if (this.config.allowedTypes.includes(file.type)) {
                this.previewFiles(file);
            } else {
                alert(`File type not allowed: ${file.name} (${file.type})`);
            }
        })
    }

    previewFiles(file) {
        const div = document.createElement('div');
        div.classList.add('file');

        const span = document.createElement('span');
        span.classList.add('name');
        span.textContent = file.name;

        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = '<span class="icon"><i class="bi bi-trash"></i></span>';
        deleteButton.classList.add('fileDelete');
        deleteButton.addEventListener("click", () => {
            const dataTransfer = new DataTransfer();
            for (let i = 0; i < this.files.length; i++) {
                const fileInList = this.files[i];
                if (fileInList.name !== file.name) {
                    dataTransfer.items.add(fileInList);
                }
            }
            this.files = dataTransfer.files;
            div.remove();
        });
        div.appendChild(span);
        div.appendChild(deleteButton);
        this.fileList.appendChild(div);
    }

    submit() {
        this.btn.addEventListener('click', (e) => {
            this.sendForm();
        })
    }

    sendForm() {
        let headers = {};
        this.dropForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(this.dropForm);
            console.log(this.files);
            
            // [...this.files].forEach(file => {
            //     formData.append(this.config.inputName, file);
            // })
            if (this.config.csrf) {
                headers = {
                    'X-CSRF-Token': this.getCSRFToken()
                }
            }
            fetch(e.target.getAttribute('action'), {
                method: 'POST',
                body: formData
            })
            .then(res => {
                if (res.ok) {
                    alert("Upload successful!");
                    window.location.href = res.url;
                }
            })
            .catch(err => {
                alert("Upload failed.");
                window.location.reload();
            });
        });
    }

    getCSRFToken() {
        return document.querySelector('meta[name=csrf-token]').getAttribute('content');
    }
}

export default DnD;