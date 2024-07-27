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
const deleteUser = (userId, csrfToken) => __awaiter(void 0, void 0, void 0, function* () {
    const url = `/api/${userId}/delete-user`;
    try {
        const response = yield fetch(url, {
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrfToken,
            },
            method: "DELETE",
        });
        return response.json();
    }
    catch (error) {
        console.log(error);
        return { isError: true };
    }
});
