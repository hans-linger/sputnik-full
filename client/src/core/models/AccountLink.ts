import { useI18n } from "vue-i18n";

const { t } = useI18n();

export default abstract class AccountLink {
	readonly name: string;

	constructor(name: string) {
		this.name = name;
	}

	get title(): string {
		return t(`networks.${this.name}`) ?? "—";
	}
}
