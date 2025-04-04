<template>
	<div class="aboutContainer">
		<div class="aboutContent">
			<div class="block">
				<div class="title">{{ $t("about.social") }}</div>
				<div class="content media">
					<div class="icon">
						<a href="https://t.me/Sputnik_Network" target="_blank">
							<InlineSvg :src="IconHelper.get('links', 'telegram')" />
						</a>
					</div>
					<div class="icon">
						<a href="https://discord.gg/GHQ57qkx8T" target="_blank">
							<InlineSvg :src="IconHelper.get('links', 'discord')" />
						</a>
					</div>
					<div class="icon">
						<a href="https://twitter.com/SputnikNetwork" target="_blank">
							<InlineSvg :src="IconHelper.get('links', 'twitter')" />
						</a>
					</div>
					<div class="icon">
						<a href="https://github.com/SputnikNetwork" target="_blank">
							<InlineSvg :src="IconHelper.get('links', 'github')" />
						</a>
					</div>
				</div>
			</div>
			<div class="block">
				<div class="title">{{ $t("about.documentation") }}</div>
				<div class="content links">
					<a href="https://docs.sputniknetwork.digital/" target="_blank">{{
						$t("about.docsLink")
					}}</a>
					<a
						href="https://docs.sputniknetwork.digital/token-usdsignal/usdsignal-tokenomics"
						target="_blank"
						>{{ $t("about.tokenomicsLink") }}</a
					>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import IconHelper from "@/core/helpers/Icons";
import InlineSvg from "vue-inline-svg";
</script>

<style lang="scss" scoped>
.aboutContainer {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	height: 100%;
}
.aboutContent {
	flex-grow: 0;
	flex-shrink: 1;
	display: flex;
	flex-direction: column;
	align-items: stretch;
	justify-content: flex-start;
	max-width: 505px;
	min-width: 300px;
	background-color: rgba(13, 13, 14, 0.9);
	padding: 100px;
}

a,
a:visited,
a:link,
:deep(svg path) {
	color: #6bdefb;
}
.icon {
	:deep(svg) {
		path {
			fill: #6bdefb;
		}
	}

	&:hover {
		:deep(svg) {
			path {
				fill: #fff;
			}
		}
	}
}
.title {
	margin: 24px 0;
	text-align: center;
	font-size: 24px;
	letter-spacing: 0.2em;
	text-transform: uppercase;
}
.content {
	display: flex;
	gap: 8px;
	justify-content: center;

	&.media {
		flex-direction: row;
	}

	&.links {
		flex-direction: column;
		text-align: center;
	}
}
</style>
