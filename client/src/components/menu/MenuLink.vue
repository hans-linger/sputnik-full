<template>
	<div v-if="isExternalLink" :class="{ wrap: true, stroked: props.stroked }" style="display: block">
		<a
			:href="props.to"
			style="display: flex; flex-direction: row; align-items: center"
			target="_blank"
			v-bind="$attrs">
			<i v-if="!props.noSpace" style="width: 40px; display: inline-block; margin-right: 5px"></i>
			<slot />
		</a>
	</div>
	<!-- @vue-ignore -->
	<RouterLink v-else :custom="true" v-bind="$props">
		<div :class="{ wrap: true, stroked: props.stroked }">
			<slot />
		</div>
	</RouterLink>
</template>

<script lang="ts" setup>
import { RouterLink } from "vue-router";
import { computed, ComputedRef } from "vue";

defineOptions({
	inheritAttrs: false,
});

const props = defineProps({
	// @ts-expect-error https://router.vuejs.org/guide/advanced/extending-router-link
	...RouterLink.props,
	disabled: {
		type: Boolean,
		default: false,
	},
	blank: {
		type: Boolean,
		default: false,
	},
	stroked: {
		type: Boolean,
		default: false,
	},
	noSpace: {
		type: Boolean,
		default: false,
	},
});

const isExternalLink: ComputedRef<boolean> = computed(() => {
	return typeof props.to === "string" && props.to.startsWith("http");
});
</script>

<style lang="scss" scoped>
a {
	display: block;
	text-decoration: none;
	padding: 4px 18px 2px;
	border-radius: 25px;
	transition:
		0.2s background-color,
		0.2s color;
	margin: 0 4px;
	cursor: pointer;
	border: 1px solid transparent;
	color: #686868;

	:deep(svg) path {
		transition-property: fill, stroke;
		transition-duration: 0.2s;
	}

	&:hover {
		border: 1px solid #232323;
		color: #fff;

		:deep(svg) {
			path {
				fill: #fff;
			}
		}
	}

	&.active,
	&:active {
		background: #393939;
		color: #fff;

		:deep(svg) {
			path {
				fill: #b930f8;
			}
		}
	}
}

a:hover .stroked {
	:deep(svg) {
		path {
			fill: none;
			stroke: #fff;
		}
	}
}
a.active .stroked,
a:active .stroked {
	:deep(svg) {
		path {
			fill: none;
			stroke: #b930f8;
		}
	}
}

.wrap {
	display: flex;
	flex-direction: row;
	align-items: center;
	font-size: 16px;
	font-family: "Figtree Regular", sans-serif;

	:deep(i) {
		flex-grow: 0;
		padding: 0 12px;
		box-sizing: border-box;
	}
}

@media (max-width: 1160px) {
	a {
		padding: 6px 7px 4px;
	}
}
</style>
