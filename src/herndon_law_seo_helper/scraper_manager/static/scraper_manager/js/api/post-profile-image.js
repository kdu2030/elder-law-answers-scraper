"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const postProfileImage = (csrfToken, imageFile) => __awaiter(void 0, void 0, void 0, function* () {
    const url = "https://herndonlawfileservice.pythonanywhere.com/file-upload";
    const formData = new FormData();
    formData.append("file", imageFile);
    try {
        const response = yield fetch(url, {
            method: "POST",
            headers: {
                "X-CSRFToken": csrfToken,
            },
            body: formData,
        });
        return response.json();
    }
    catch (error) {
        return { isError: true };
    }
});
