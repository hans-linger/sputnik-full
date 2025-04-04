export const icons: Record<string, Record<string, string>> = {};

const iconFilelist: Record<string, { default: string }> = import.meta.glob(
	["../../assets/icons/**/*.svg", "../../assets/icons/**/*.png"],
	{ eager: true }
);

Object.entries(iconFilelist).map(([key, file]) => {
	const arr = key.match(/^.+([./])([^/]+)([./])([^.]+){1}\.(svg|png)$/);
	if (arr == null) return;
	if (!(arr[2] in icons)) {
		icons[arr[2]] = {};
	}
	icons[arr[2]][arr[4]] = file.default;
});

// TODO move network icons to server
export default class IconHelper {
	static get(section: string, name: string): string {
		if (!(section in icons) || !(name in icons[section])) {
			return "";
		}
		return icons[section][name];
	}

	// TODO preload images
}
