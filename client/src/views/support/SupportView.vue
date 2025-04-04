<template>
	<MainLayout>
		<div class="supportContainer">
			<div class="formContainer section">
				<div class="title">{{ $t("support.support") }}</div>
				<div class="form">
					<div class="block">
						<label for="email">{{ $t("support.email") }}</label>
						<InputText id="email" :placeholder="$t('support.emailPlaceholder')" fluid />
					</div>
					<div class="block">
						<label for="message">{{ $t("support.message") }}</label>
						<Textarea id="message" fluid></Textarea>
					</div>
					<div class="block button">
						<MainButton :label="$t('buttons.send')" />
					</div>
				</div>
			</div>
			<div class="blocksContainer section">
				<div class="title">FAQ</div>
				<div class="content">
					<Accordion :value="currentValue">
						<AccordionPanel v-for="(item, i) in data" :key="i" :value="i">
							<AccordionHeader :asChild="true">
								<div class="header" @click="setCurrent(i)">
									<div class="wrap">
										<div class="text">{{ item.title }}</div>
										<span class="toggler">
											<InlineSvg
												v-show="i !== currentValue"
												:src="IconHelper.get('common', 'chevron-wide-down')" />
											<InlineSvg
												v-show="i === currentValue"
												:src="IconHelper.get('common', 'chevron-wide-up')" />
										</span>
									</div>
								</div>
							</AccordionHeader>
							<AccordionContent>{{ item.content }}</AccordionContent>
						</AccordionPanel>
					</Accordion>
				</div>
			</div>
		</div>
	</MainLayout>
</template>

<script lang="ts" setup>
import MainLayout from "@/components/layout/MainLayout.vue";
import {
	Accordion,
	AccordionContent,
	AccordionHeader,
	AccordionPanel,
	InputText,
	Textarea,
} from "primevue";
import { shallowRef, ShallowRef } from "vue";
import IconHelper from "@/core/helpers/Icons";
import InlineSvg from "vue-inline-svg";
import MainButton from "@/components/common/MainButton.vue";

const currentValue: ShallowRef<number | null> = shallowRef(null);

const data: Array<{ title: string; content: string }> = [
	{ title: "What is love?", content: "Baby don't hurt me" },
	{
		title: "Stop rubilnik",
		content:
			"Stop holodilnik, stop svetilnik, stop morozilnik, stop kipyatilnik, stop nasilnik it's my life",
	},
];

function setCurrent(v: number): void {
	currentValue.value = currentValue.value === v ? null : v;
}
</script>

<style lang="scss" scoped>
.supportContainer {
	padding-top: 100px;

	.section {
		margin-bottom: 48px;

		.title {
			text-align: center;
			font-size: 24px;
			letter-spacing: 0.2em;
			text-transform: uppercase;
			margin-bottom: 40px;
		}
	}
}

.blocksContainer {
	margin: 0 30px;
}

.p-accordionpanel {
	border: 1px solid #37373f;
	border-radius: 10px;
	margin-bottom: 8px;
	cursor: pointer;

	&:hover {
		border-color: #686868;
	}

	.header {
		padding: 8px 15px;

		.wrap {
			display: flex;
			flex-direction: row;
			justify-content: stretch;
			align-items: center;

			.text {
				flex-grow: 1;
				text-transform: uppercase;
				line-height: 22px;
				letter-spacing: 0.08em;
				font-family: "Figtree Medium", sans-serif;
			}

			.toggler {
				flex-grow: 0;
				margin-bottom: -5px;
			}
		}
	}

	:deep(.p-accordioncontent-content) {
		padding: 8px 15px;
	}
}

.formContainer {
	margin: 0 130px;

	.block {
		margin-bottom: 20px;

		&.button {
			text-align: center;
		}
	}

	label {
		font-family: "Figtree Regular", sans-serif;
		font-size: 14px;
		letter-spacing: 0.05em;
		display: block;
		margin-bottom: 5px;
	}

	input,
	textarea {
		padding: 12px;
	}
}
</style>
