import PageLoading from '@/components/page-loading'
import PageShell from '@/components/page-shell'

/** 유물 세팅 상세 라우트 진입 시 즉시 보여줄 fallback */
function RelicSetupDetailLoading() {
	return (
		<PageShell>
			<PageLoading variant="detail" />
		</PageShell>
	)
}

export default RelicSetupDetailLoading
