<template>
	<div ref="placeholder"></div>
</template>

<script lang="ts" setup>
import { onBeforeMount, onMounted, type Ref, useTemplateRef } from "vue";

const props = defineProps({
	telegramLogin: {
		type: String,
		required: true,
		validator: (value: string) => value.toLowerCase().endsWith("bot"),
	},
	requestAccess: {
		type: String,
		default: "read",
		validator: (value: string) => ["read", "write"].includes(value),
	},
	size: {
		type: String,
		default: "medium",
		validator: (value: string) => ["small", "medium", "large"].includes(value),
	},
	userpic: {
		type: Boolean,
		default: true,
	},
	radius: {
		type: Number,
	},
});

export type TelegramAuthResponse = {
	id: number;
	first_name: string;
	last_name: string;
	username: string;
	photo_url: string;
	auth_date: number;
	hash: string;
};

const emits = defineEmits<{
	(e: "loaded"): void;
	(e: "callback", data: TelegramAuthResponse): void;
}>();

const placeholder: Ref<HTMLDivElement | null> = useTemplateRef("placeholder");
const script = document.createElement("script");

function onTelegramAuth(user: TelegramAuthResponse) {
	emits("callback", user);
}

onBeforeMount(() => {
	script.type = "text/javascript";
	script.async = true;

	script.src = "https://telegram.org/js/telegram-widget.js?22";

	script.setAttribute("data-size", props.size);
	script.setAttribute("data-userpic", props.userpic.toString());
	script.setAttribute("data-telegram-login", props.telegramLogin);
	script.setAttribute("data-request-access", props.requestAccess);

	script.onload = () => {
		emits("loaded");
	};

	// @ts-expect-error fuck this
	window["onTelegramAuth"] = onTelegramAuth.bind(this);
	script.setAttribute("data-onauth", "window.onTelegramAuth(user)");
});

onMounted(() => {
	if (placeholder.value != null) {
		placeholder.value.appendChild(script);
	}
});
</script>

<style lang="scss" scoped></style>
