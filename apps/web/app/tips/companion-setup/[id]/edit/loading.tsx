import PageLoading from '@/components/page-loading'
import PageShell from '@/components/page-shell'

/** 동료 세팅 수정 라우트 진입 시 즉시 보여줄 fallback */
function CompanionSetupEditLoading() {
	return (
		<PageShell>
			<PageLoading variant="detail" />
		</PageShell>
	)
}

export default CompanionSetupEditLoading
