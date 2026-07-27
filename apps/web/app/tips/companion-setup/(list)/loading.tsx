import PageLoading from '@/components/page-loading'
import PageShell from '@/components/page-shell'

/**
 * 목록 전용 loading — (list) 라우트 그룹에 두어 /new · /[id]에는 적용되지 않습니다.
 * (new는 DB 없이 바로 폼을 그리므로 hub skeleton이 뜨면 안 됩니다.)
 */
function CompanionSetupLoading() {
	return (
		<PageShell>
			<PageLoading variant="hub" />
		</PageShell>
	)
}

export default CompanionSetupLoading
