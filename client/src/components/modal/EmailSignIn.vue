<template>
	<div class="emailLoginContainer">
		<div v-if="currentScreen == null" class="choice">
			<MainButton
				:label="t('auth.login')"
				@click="changeScreenKind(ScreenKind.LoginScreen)"></MainButton>
			<MainButton
				:label="t('auth.signUp')"
				@click="changeScreenKind(ScreenKind.SignUpScreen)"></MainButton>
			<div class="text">or</div>
			<MainButton :label="t('auth.loginWithGoogle')" @click="onGoogleLogin"></MainButton>
		</div>
		<div v-else-if="currentScreen == ScreenKind.LoginScreen">
			<div class="formContainer">
				<InputText placeholder="Email" />
				<InputText placeholder="Password" type="password" />
				<MainButton label="Login" @click="fakeLogin" />
			</div>
		</div>
		<div v-else-if="currentScreen == ScreenKind.SignUpScreen">
			<div class="formContainer">
				<InputText placeholder="Email" />
				<InputText placeholder="Password" type="password" />
				<InputText placeholder="Repeat Password" type="password" />
				<MainButton label="Login" @click="fakeLogin" />
			</div>
		</div>
		<div v-else-if="currentScreen == ScreenKind.GoogleSignInScreen" class="googleLoginContainer">
			<MainButton label="Login" @click="onGoogleLogin" />
		</div>
	</div>
</template>

<script lang="ts" setup>
import MainButton from "@/components/common/MainButton.vue";
import { useI18n } from "vue-i18n";
import { ref, type Ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { InputText } from "primevue";
import router from "@/router";
import { main } from "@/core/globals";

const authStore = useAuthStore();

enum ScreenKind {
	LoginScreen = "LoginScreen",
	SignUpScreen = "SignUpScreen",
	GoogleSignInScreen = "GoogleSignInScreen",
}

const { t } = useI18n();

const currentScreen: Ref<ScreenKind | null> = ref(null);
type GoogleResponse = {
	clientId: string;
	client_id?: string;
	credential: string;
	select_by:
		| "auto"
		| "user"
		| "user_1tap"
		| "user_2tap"
		| "btn"
		| "btn_confirm"
		| "brn_add_session"
		| "btn_confirm_add_session";
};

function changeScreenKind(screenKind: ScreenKind) {
	currentScreen.value = screenKind;
}

function onGoogleLogin(data: GoogleResponse): void {
	document.location = `${main().config.apiBaseUrl}/auth/google`;
}

function fakeLogin(): void {
	router.push("/");
}
</script>

<style lang="scss" scoped>
.emailLoginContainer {
	:deep(.p-button) {
		padding: 12px;
	}
}

.choice,
.formContainer {
	display: flex;
	flex-direction: column;
	gap: 8px;
	align-items: stretch;

	.text {
		text-align: center;
		color: #a7a7af;
	}
}

.googleLoginContainer {
	display: flex;
	justify-content: center;
	align-items: center;

	.g-btn div {
		background: #000;
	}
}
</style>
