import { defineStore } from "pinia";
import {KJUR, b64utoutf8} from "jsrsasign";
import {SALT, ISS_DOMAIN} from "@/constants.js";
import {ref} from "vue";

const alg = 'HS256'
const clientDomain = ISS_DOMAIN

export const useSignStore = defineStore("ss", () => {

    const payLoad = ref({})

    function verify(str) {
        return KJUR.jws.JWS.verifyJWT(str.trim(), SALT, {
            alg: [alg],
            iss: [clientDomain]
        });
    }

    function parsePayload(str) {
        payLoad.value = KJUR.jws.JWS.readSafeJSONString(b64utoutf8(str.split(".")[1]));
    }

    return {
        payLoad,
        verify,
        parsePayload
    }
})