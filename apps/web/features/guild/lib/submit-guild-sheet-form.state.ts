/** useActionState 초기값·반환 타입. 'use server' 파일 밖에 둡니다. */

type SubmitGuildSheetFormState = {
	ok: boolean
	message: string | null
}

const INITIAL_SUBMIT_GUILD_SHEET_FORM_STATE: SubmitGuildSheetFormState = {
	ok: false,
	message: null
}

export { INITIAL_SUBMIT_GUILD_SHEET_FORM_STATE }
export type { SubmitGuildSheetFormState }
