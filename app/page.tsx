"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { parseISO, differenceInDays, format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useNovenaStore } from '../store/useNovenaStore'
import { novenas } from '../data'

export default function HomePage() {
  const router = useRouter()
  const { novenas: activeNovenas, createNovena, deleteNovena } = useNovenaStore()
  const [selectedNovena, setSelectedNovena] = useState('carlo-acutis')
  const [selectedDate, setSelectedDate] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [tab, setTab] = useState<'ativas' | 'concluidas'>('ativas')
  const [concluidasPage, setConcluidasPage] = useState(1)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [novenaToDelete, setNovenaToDelete] = useState<string | null>(null)
  const CONCLUIDAS_PER_PAGE = 5

  useEffect(() => {
    setIsMounted(true)
  }, [])

  function startNovena() {
    if (!selectedDate) return alert('Escolha a data de início')
    const novenaId = createNovena(selectedNovena, selectedDate)
    setSelectedDate('')
    setShowCreateForm(false)
    router.push(`/novena/${novenaId}`)
  }

  function getCurrentDay(startDate: string) {
    const diff = differenceInDays(new Date(), parseISO(startDate))
    return Math.max(1, Math.min(9, diff + 1))
  }

  function getNovenaProgress(novena: any) {
    const currentDay = getCurrentDay(novena.startDate)
    const completed = novena.completedDays.length
    // Só considera concluída se todos os 9 dias foram marcados
    const isFinished = completed === 9
    return { currentDay, completed, isFinished }
  }

  if (!isMounted) return null

  // Separar novenas ativas e concluídas
  const novenasComProgresso = activeNovenas.map(novena => ({
    ...novena,
    progress: getNovenaProgress(novena),
    novenaData: novenas[novena.type as keyof typeof novenas],
  }))
  const novenasAtivas = novenasComProgresso.filter(n => !n.progress.isFinished)
  const novenasConcluidas = novenasComProgresso.filter(n => n.progress.isFinished)

  return (
    <section className="mt-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold mb-2">Suas Novenas</h1>
          <p className="text-gray-700 text-sm sm:text-base">Gerencie suas novenas ativas e inicie novas jornadas espirituais.</p>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="w-full sm:w-auto px-4 py-3 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 font-medium"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nova Novena
        </button>
      </div>

      {/* Tabs de navegação */}
      <div className="flex gap-2 mb-6">
        <button
          className={`px-4 py-2 rounded-t-lg font-medium border-b-2 transition-colors ${tab === 'ativas' ? 'border-blue-600 text-blue-700 bg-blue-50' : 'border-transparent text-gray-500 bg-transparent hover:bg-gray-100'}`}
          onClick={() => setTab('ativas')}
        >
          Ativas
        </button>
        <button
          className={`px-4 py-2 rounded-t-lg font-medium border-b-2 transition-colors ${tab === 'concluidas' ? 'border-green-600 text-green-700 bg-green-50' : 'border-transparent text-gray-500 bg-transparent hover:bg-gray-100'}`}
          onClick={() => setTab('concluidas')}
        >
          Concluídas
        </button>
      </div>

      {/* Formulário para criar nova novena */}
      {showCreateForm && (
        <div className="mb-8 p-4 sm:p-6 bg-gray-50 rounded-lg border">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Iniciar Nova Novena</h2>
          
          {selectedNovena === 'santa-teresinha' && (
            <div className="mb-4 p-4 bg-rose-50 border border-rose-200 rounded-lg">
              <h3 className="font-semibold text-rose-800 mb-2">🌹 Novena da Rosa Milagrosa</h3>
              <p className="text-rose-700 text-sm">
                Santa Teresinha promete enviar uma rosa como sinal de que a graça será concedida. 
                Esta novena consiste na mesma oração rezada por 9 dias consecutivos, 
                seguida de 24 Glórias ao Pai.
              </p>
              <h2 className='text-rose-800 m-2'>Dia que se celebra Santa Teresinha - 1º de outubro</h2>
              <p className="text-rose-700 text-sm">
                Comece sua novena em qualquer data, mas para uma experiência especial,
                considere iniciá-la no dia 22 de setembro, terminando no dia 1º de outubro.
              </p>
            </div>
          )}
          
          {selectedNovena === 'carlo-acutis' && (
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">💻 Novena do Santo da Internet</h3>
              <p className="text-blue-700 text-sm">
                São Carlo Acutis, padroeiro da internet e jovem santo, intercede por nós 
                com orações específicas para cada dia, focando em temas como Eucaristia, 
                santidade e amor a Jesus.
              </p>
                <h2 className='text-blue-800 m-2'>Dia que se celebra São Carlo Acutis - 12 de outubro</h2>
                <p className="text-blue-700 text-sm">
                    Para uma experiência especial, considere iniciar sua novena no dia 3 de outubro,
                    terminando no dia 12 de outubro.
                </p>
            </div>
          )}
          {selectedNovena === 'nossa-senhora-do-carmo' && (
            <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <h3 className="font-semibold text-amber-800 mb-2">🔥 Novena a Nossa Senhora do Carmo</h3>

                <p className="text-amber-700 text-sm">
                Esta novena conduz o fiel a aprofundar a vida interior, a confiança filial
                e a fé purificada, segundo a espiritualidade do Carmelo.
                Guiada por Nossa Senhora do Carmo e iluminada por Santa Teresa d’Ávila,
                Santa Teresinha do Menino Jesus e São João da Cruz,
                ela prepara a alma para viver e adorar melhor Jesus na Eucaristia
                e para comungar com maior reverência e amor.
                </p>

                <h2 className="text-amber-800 m-2">
                Festa de Nossa Senhora do Carmo – 16 de julho
                </h2>

                <p className="text-amber-700 text-sm">
                Para uma vivência espiritual mais intensa, recomenda-se iniciar a novena
                no dia 7 de julho, concluindo-a na solenidade de Nossa Senhora do Carmo,
                renovando o amor à Eucaristia e o compromisso com a vida de oração cotidiana.
                </p>
            </div>
         )}

            {selectedNovena === 'novena-de-natal' && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">🎄 Novena de Natal</h3>
              <p className="text-green-700 text-sm">
                Prepare-se para o Natal com esta novena especial que celebra o nascimento de Jesus. 
                Cada dia traz uma reflexão e oração para se preparar para celebrar o Natal.
              </p>
                <h2 className='text-green-800 m-2'>Dia que se celebra o Natal - 25 de dezembro</h2>
                <p className="text-green-700 text-sm">
                    Para uma experiência especial, considere iniciar sua novena no dia 16 de dezembro,
                    terminando no dia 25 de dezembro.
                </p>
            </div>
          )}
          <div className="flex flex-col gap-4 w-full">
            <div>
              <label className="text-sm block font-medium text-indigo-900 mb-1" htmlFor="novena-select">Selecione uma novena</label>
              <select className="border p-3 w-full rounded-lg text-base" value={selectedNovena} onChange={(e) => setSelectedNovena(e.target.value)}>
                <option value="carlo-acutis">Novena a Carlo Acutis</option>
                <option value="santa-teresinha">Novena a Santa Teresinha</option>
                <option value="novena-de-natal">Novena de Natal</option>
                <option value="nossa-senhora-do-carmo">Novena a Nossa Senhora do Carmo</option>
              </select>
            </div>

            <div>
                <label className="text-sm font-medium block text-indigo-900 mb-1" htmlFor="data-inicio">Data de início</label>
                <input
                id="data-inicio"
                type="date"
                className="border p-3 rounded-lg text-base w-full min-w-0"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                inputMode="numeric"
                />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={startNovena} className="flex-1 px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-medium">
                Iniciar Novena
              </button>
              <button 
                onClick={() => setShowCreateForm(false)} 
                className="flex-1 sm:flex-none px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-medium"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lista de novenas */}
      {tab === 'ativas' && (
        novenasAtivas.length > 0 ? (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Novenas Ativas</h2>
            {novenasAtivas.map((novena) => {
              // Verifica se o dia atual ainda não foi rezado
              const needsToPrayToday = !novena.completedDays.includes(novena.progress.currentDay) && novena.progress.currentDay <= 9;
              return (
                <div key={novena.id} className="p-4 bg-white border rounded-lg shadow-sm relative">
                  {needsToPrayToday && (
                    <div className="absolute -top-3 right-3 flex items-center gap-1 animate-bounce z-10">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-green-500 text-white font-semibold text-xs shadow-lg border border-green-600">
                        <svg className="w-4 h-4 mr-1 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 01.894.553l7 14A1 1 0 0117 18H3a1 1 0 01-.894-1.447l7-14A1 1 0 0110 2zm0 3.618L4.618 16h10.764L10 5.618zM9 8h2v4H9V8zm0 6h2v2H9v-2z" /></svg>
                        Reze o dia de hoje
                      </span>
                    </div>
                  )}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{novena.novenaData.name}</h3>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-600">
                        <span>Início: {format(parseISO(novena.startDate), 'dd/MM/yyyy', { locale: ptBR })}</span>
                        <span>Dia atual: {novena.progress.currentDay}</span>
                        <span>Dias rezados: {novena.progress.completed}/9</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:flex-shrink-0">
                      <button
                        onClick={() => router.push(`/novena/${novena.id}`)}
                        className="flex-1 sm:flex-none px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium text-sm"
                      >
                        Continuar
                      </button>
                      <button
                        onClick={() => { setNovenaToDelete(novena.id); setShowDeleteModal(true); }}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded flex-shrink-0"
                        title="Excluir novena"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  {/* Barra de progresso */}
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-blue-500"
                      style={{ width: `${(novena.progress.completed / 9) * 100}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          !showCreateForm && (
            <div className="text-center py-12">
              <div className="mb-4">
                <svg className="w-16 h-16 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma novena ativa</h3>
              <p className="text-gray-500 mb-4">Comece uma nova jornada espiritual clicando no botão acima.</p>
            </div>
          )
        )
      )}

      {tab === 'concluidas' && (
        novenasConcluidas.length > 0 ? (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Novenas Concluídas
            </h2>
            {novenasConcluidas.slice(0, concluidasPage * CONCLUIDAS_PER_PAGE).map((novena) => (
              <div key={novena.id} className="p-4 bg-green-50 border border-green-200 rounded-lg shadow-sm opacity-80 hover:opacity-100 transition-opacity">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                      {novena.novenaData.name}
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-200 text-green-800 ml-2">Concluída</span>
                    </h3>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-600">
                      <span>Início: {format(parseISO(novena.startDate), 'dd/MM/yyyy', { locale: ptBR })}</span>
                      <span>Finalizada</span>
                      <span>Dias rezados: 9/9</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:flex-shrink-0">
                    <button
                      onClick={() => router.push(`/novena/${novena.id}`)}
                      className="flex-1 sm:flex-none px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-medium text-sm"
                    >
                      Ver Completa
                    </button>
                    <button
                      onClick={() => deleteNovena(novena.id)}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded flex-shrink-0"
                      title="Excluir novena"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                {/* Barra de progresso */}
                <div className="w-full bg-green-200 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full bg-green-500"
                    style={{ width: `100%` }}
                  ></div>
                </div>
              </div>
            ))}
            {novenasConcluidas.length > concluidasPage * CONCLUIDAS_PER_PAGE && (
              <div className="flex justify-center mt-4">
                <button
                  onClick={() => setConcluidasPage(concluidasPage + 1)}
                  className="px-6 py-2 bg-green-100 text-green-800 rounded hover:bg-green-200 font-medium"
                >
                  Carregar mais
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="mb-4">
              <svg className="w-16 h-16 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma novena concluída</h3>
            <p className="text-gray-500 mb-4">Ao concluir uma novena, ela aparecerá aqui.</p>
          </div>
        )
      )}
      {/* Modal de confirmação de exclusão */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-xs w-full">
            <h3 className="text-lg font-semibold mb-2 text-red-700">Excluir novena?</h3>
            <p className="text-gray-700 mb-4 text-sm">Tem certeza que deseja excluir esta novena? Esta ação não pode ser desfeita.</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-3 py-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  if (novenaToDelete) deleteNovena(novenaToDelete)
                  setShowDeleteModal(false)
                  setNovenaToDelete(null)
                }}
                className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 text-sm font-medium"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
