/**
 * 경영집행위원회 Frontend - Vanilla JS with Simple Routing and Agenda CUD
 */

console.log('경영집행위원회 Script Loading...');

// --- 1. Global Data State ---
let meetings = [
    { id: 1, title: 'Q1 마케팅 전략 수립 회의', date: '2024.03.12 14:00', location: '제1회의실', status: '진행중' },
    { id: 2, title: '신규 기능 디자인 리뷰', date: '2024.03.13 10:00', location: '제2회의실', status: '예정됨' },
    { id: 3, title: '주간 팀 싱크업', date: '2024.03.14 11:00', location: '온라인', status: '예정됨' }
];

let agendas = [
    { id: 1, meetingId: 1, title: '디자인 가이드 문서 배포', author: 'Jane Doe', status: '진행중', description: '브랜드 아이덴티티 강화를 위한 전사 디자인 가이드라인 배포 및 교육 건입니다.', reviews: [] },
    { id: 2, meetingId: 1, title: '주간 보고 자료 취합', author: 'John Smith', status: '예정됨', description: '각 부서별 주간 실적 및 계획 공유를 위한 자료 취합 프로세스 안내입니다.', reviews: [] },
    { id: 3, meetingId: 1, title: '신규 프로젝트 예산 검토', author: 'Jane Doe', status: '예정됨', description: '2024년 상반기 신규 TF팀 운영을 위한 초기 예산안 검토 요청 건입니다.', reviews: [{ user: 'Alice Wong', role: '결정 위원', comment: '초기 예산 규모가 예상보다 큽니다. 상세 산출 내역 보완이 필요해 보입니다.', date: '2024.03.12' }] },
    { id: 4, meetingId: 2, title: '신규 아이콘 시스템 검토', author: 'Alice Wong', status: '예정됨', description: '앱 내 직관성 향상을 위한 신규 일러스트 형태 아이콘 도입 검토입니다.', reviews: [] }
];

let users = [
    { id: 1, full_name: 'Jane Doe', email: 'jane@example.com', role: '관리자' },
    { id: 2, full_name: 'John Smith', email: 'john@example.com', role: '일반 사용자' },
    { id: 3, full_name: 'Alice Wong', email: 'alice@example.com', role: '결정 위원' }
];

let expandedMeetingId = null;

// --- 2. Views Configuration ---
const views = {
    dashboard: () => `
        <header class="flex justify-between items-center mb-10">
            <div>
                <h2 class="text-3xl font-bold text-slate-900 mb-1">안녕하세요, Jane님! 👋</h2>
                <p class="text-slate-500">오늘 예정된 회의가 <span class="font-semibold text-brand-600">3개</span> 있습니다.</p>
            </div>
            <div class="flex items-center gap-4">
                <button class="p-2 text-slate-400 hover:text-slate-600 bg-white border border-slate-200 rounded-full glass transition-all">
                    <i data-lucide="search" class="w-5 h-5"></i>
                </button>
                <button id="create-meeting-btn-header" onclick="navigateTo('create')" class="bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-lg shadow-brand-500/20">
                    <i data-lucide="plus" class="w-4 h-4"></i>
                    새 회의 만들기
                </button>
            </div>
        </header>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div class="flex items-center justify-between mb-4">
                    <div class="p-2 bg-blue-50 text-blue-600 rounded-lg"><i data-lucide="calendar" class="w-6 h-6"></i></div>
                </div>
                <h3 class="text-slate-500 text-sm font-medium mb-1">이번 주 회의</h3>
                <p class="text-2xl font-bold text-slate-800">${meetings.length}</p>
            </div>
            <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div class="flex items-center justify-between mb-4">
                    <div class="p-2 bg-amber-50 text-amber-600 rounded-lg"><i data-lucide="clock" class="w-6 h-6"></i></div>
                </div>
                <h3 class="text-slate-500 text-sm font-medium mb-1">대기 중인 안건</h3>
                <p class="text-2xl font-bold text-slate-800">${agendas.length}</p>
            </div>
            <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div class="flex items-center justify-between mb-4">
                    <div class="p-2 bg-purple-50 text-purple-600 rounded-lg"><i data-lucide="users" class="w-6 h-6"></i></div>
                </div>
                <h3 class="text-slate-500 text-sm font-medium mb-1">등록된 사용자</h3>
                <p class="text-2xl font-bold text-slate-800">${users.length}</p>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div class="space-y-6">
                <div class="flex items-center justify-between">
                    <h3 class="text-xl font-bold text-slate-800">예정된 회의</h3>
                    <a href="javascript:navigateTo('meetings')" class="text-sm font-semibold text-brand-600 hover:text-brand-700">모두 보기</a>
                </div>
                <div class="space-y-4">
                    ${meetings.slice(0, 2).map(m => `
                        <div onclick="navigateTo('meetings'); toggleMeetingAgendas(${m.id});" class="bg-white p-6 rounded-2xl border border-slate-100 hover:shadow-md transition-all cursor-pointer group">
                            <h4 class="text-lg font-bold text-slate-800 group-hover:text-brand-600 mb-1">${m.title}</h4>
                            <p class="text-sm text-slate-500">${m.location} • ${m.date}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="space-y-6">
                <div class="flex items-center justify-between">
                    <h3 class="text-xl font-bold text-slate-800">현재 안건</h3>
                    <a href="javascript:navigateTo('agendas')" class="text-sm font-semibold text-brand-600 hover:text-brand-700">관리하기</a>
                </div>
                <div class="bg-white p-6 rounded-3xl border border-slate-100 space-y-4">
                    ${agendas.slice(0, 3).map(a => `
                        <div class="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                            <span class="text-sm font-medium text-slate-700">${a.title}</span>
                            <span class="text-[10px] font-bold px-2 py-0.5 rounded-full ${a.status === '진행중' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-400'}">
                                ${a.status || '대기중'}
                            </span>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `,
    meetings: () => `
        <div class="space-y-8">
            <header class="flex justify-between items-center">
                <div>
                    <h2 class="text-3xl font-bold text-slate-900 mb-1">회의 목록</h2>
                    <p class="text-slate-500">회의를 클릭하여 하위 안건을 확인하세요.</p>
                </div>
            </header>
            <div class="space-y-4">
                ${meetings.map(m => {
        const isExpanded = expandedMeetingId === m.id;
        const meetingAgendas = agendas.filter(a => a.meetingId === m.id);
        return `
                        <div class="bg-white rounded-2xl border ${isExpanded ? 'border-brand-500 shadow-lg' : 'border-slate-200 shadow-sm'} overflow-hidden transition-all">
                            <div onclick="toggleMeetingAgendas(${m.id})" class="p-6 cursor-pointer hover:bg-slate-50 flex items-center justify-between">
                                <div class="flex items-center gap-4">
                                    <div class="p-2 ${isExpanded ? 'bg-brand-100 text-brand-600' : 'bg-slate-100 text-slate-500'} rounded-lg transition-all">
                                        <i data-lucide="${isExpanded ? 'chevron-down' : 'chevron-right'}" class="w-5 h-5"></i>
                                    </div>
                                    <div>
                                        <h4 class="text-lg font-bold text-slate-800">${m.title}</h4>
                                        <p class="text-sm text-slate-500">${m.location} • ${m.date}</p>
                                    </div>
                                </div>
                                <div class="flex items-center gap-3">
                                    <span class="text-xs font-semibold text-slate-400">${meetingAgendas.length}개의 안건</span>
                                    <span class="px-2.5 py-1 rounded-full text-[11px] font-bold ${m.status === '진행중' ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-500'}">
                                        ${m.status}
                                    </span>
                                </div>
                            </div>
                            
                            ${isExpanded ? `
                                <div class="border-t border-slate-100 bg-slate-50/50 p-6 space-y-3">
                                    <div class="flex items-center justify-between mb-2">
                                        <h5 class="text-xs font-bold text-slate-400 uppercase tracking-wider">회의 안건 리스트</h5>
                                        <button onclick="showAgendaForm(false, ${m.id})" class="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 transition-all">
                                            <i data-lucide="plus" class="w-3 h-3"></i>
                                            안건 추가
                                        </button>
                                    </div>
                                    ${meetingAgendas.length === 0 ? `
                                        <p class="text-sm text-slate-400 py-2">등록된 안건이 없습니다.</p>
                                    ` : meetingAgendas.map((a, idx) => `
                                        <div class="flex flex-col bg-white rounded-2xl border border-slate-100 shadow-sm group/item hover:border-brand-200 transition-all">
                                            <div class="flex items-center justify-between p-4 cursor-pointer" onclick="this.parentElement.querySelector('.agenda-detail').classList.toggle('hidden')">
                                                <div class="flex items-center gap-3">
                                                    <span class="w-6 h-6 flex items-center justify-center bg-slate-100 rounded text-xs font-bold text-slate-500">${idx + 1}</span>
                                                    <div class="flex flex-col">
                                                        <span class="font-bold text-slate-700">${a.title}</span>
                                                        <span class="text-[10px] text-slate-400">작성자: ${a.author || '미지정'}</span>
                                                    </div>
                                                </div>
                                                <div class="flex items-center gap-4">
                                                    <div class="flex items-center gap-1 opacity-0 group-hover/item:opacity-100 transition-all">
                                                        <button onclick="event.stopPropagation(); editAgenda(${a.id})" class="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-md transition-all">
                                                            <i data-lucide="edit-3" class="w-4 h-4"></i>
                                                        </button>
                                                        <button onclick="event.stopPropagation(); deleteAgenda(${a.id})" class="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-all">
                                                            <i data-lucide="trash-2" class="w-4 h-4"></i>
                                                        </button>
                                                    </div>
                                                    <div class="flex items-center gap-3">
                                                        <span class="text-[10px] font-bold px-2 py-0.5 rounded-full ${a.status === '진행중' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-400'}">
                                                            ${a.status || '대기중'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="agenda-detail hidden p-4 pt-0 border-t border-slate-50 bg-slate-50/30">
                                                <div class="mt-3">
                                                    <h6 class="text-[10px] font-bold text-slate-400 uppercase mb-1">상세 설명</h6>
                                                    <p class="text-sm text-slate-600 leading-relaxed">${a.description || '내용이 없습니다.'}</p>
                                                </div>
                                                
                                                <div class="mt-4 space-y-3">
                                                    <h6 class="text-[10px] font-bold text-slate-400 uppercase mb-2">검토 의견 (${a.reviews ? a.reviews.length : 0})</h6>
                                                    ${a.reviews && a.reviews.length > 0 ? a.reviews.map(r => `
                                                        <div class="bg-white p-3 rounded-xl border border-slate-100 text-xs">
                                                            <div class="flex justify-between mb-1">
                                                                <span class="font-bold text-brand-700">${r.user} <span class="text-[10px] text-slate-400 ml-1">${r.role}</span></span>
                                                                <span class="text-slate-300">${r.date}</span>
                                                            </div>
                                                            <p class="text-slate-600">${r.comment}</p>
                                                        </div>
                                                    `).join('') : '<p class="text-xs text-slate-400 italic">등록된 검토 의견이 없습니다.</p>'}
                                                    
                                                    <div class="mt-4 pt-4 border-t border-slate-100">
                                                        <div class="flex items-center gap-2 mb-2">
                                                            <i data-lucide="message-square" class="w-3 h-3 text-amber-500"></i>
                                                            <span class="text-[10px] font-bold text-slate-500">결정 위원 검토 의견 남기기</span>
                                                        </div>
                                                        <div class="flex gap-2">
                                                            <input type="text" id="review-input-${a.id}" placeholder="의견을 입력하세요..." class="flex-1 text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-brand-500 transition-all">
                                                            <button onclick="handleReviewSubmit(${a.id})" class="bg-amber-500 hover:bg-amber-600 text-white px-3 py-2 rounded-lg text-xs font-bold transition-all">등록</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            ` : ''}
                        </div>
                    `;
    }).join('')}
            </div>
        </div>
    `,
    create: () => `
        <div class="max-w-2xl mx-auto space-y-8">
            <header>
                <h2 class="text-3xl font-bold text-slate-900 mb-1">새 회의 생성</h2>
            </header>
            <form id="create-meeting-form" onsubmit="handleMeetingCreate(event)" class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <div class="space-y-2">
                    <label class="text-sm font-bold text-slate-700">회의 제목</label>
                    <input type="text" id="m-title" required class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500 transition-all">
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div class="space-y-2">
                        <label class="text-sm font-bold text-slate-700">날짜 및 시간</label>
                        <input type="datetime-local" id="m-date" required class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500 transition-all">
                    </div>
                    <div class="space-y-2">
                        <label class="text-sm font-bold text-slate-700">장소</label>
                        <input type="text" id="m-location" required class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500 transition-all">
                    </div>
                </div>
                <div class="flex gap-3">
                    <button type="button" onclick="navigateTo('dashboard')" class="flex-1 px-6 py-4 rounded-xl font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all">취소</button>
                    <button type="submit" class="flex-[2] px-6 py-4 rounded-xl font-bold bg-brand-600 text-white hover:bg-brand-700 transition-all">생성하기</button>
                </div>
            </form>
        </div>
    `,
    agendas: () => `
        <div class="space-y-8">
            <header class="flex justify-between items-center">
                <div>
                    <h2 class="text-3xl font-bold text-slate-900 mb-1">회의 안건 (전체)</h2>
                    <p class="text-slate-500">모든 회의의 안건들을 확인하고 관리하세요.</p>
                </div>
                <button onclick="showAgendaForm()" class="bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-lg shadow-brand-500/20">
                    <i data-lucide="plus" class="w-4 h-4"></i>
                    안건 추가하기
                </button>
            </header>

            <div id="agenda-form-container" class="hidden bg-white p-6 rounded-2xl border-2 border-brand-500/20 shadow-xl mb-8">
                <h3 id="form-title" class="text-lg font-bold text-brand-700 mb-4">새 안건 작성</h3>
                <form id="agenda-form" onsubmit="handleAgendaSubmit(event)" class="space-y-4">
                    <input type="hidden" id="agenda-id">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="space-y-1">
                            <label class="text-xs font-bold text-slate-500">회의 선택</label>
                            <select id="agenda-meeting-id" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500 transition-all bg-white">
                                ${meetings.map(m => `<option value="${m.id}">${m.title}</option>`).join('')}
                            </select>
                        </div>
                        <div class="space-y-1">
                            <label class="text-xs font-bold text-slate-500">안건 제목</label>
                            <input type="text" id="agenda-title" required placeholder="예: 디자인 가이드 최종 검토" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500 transition-all">
                        </div>
                        <div class="space-y-1">
                            <label class="text-xs font-bold text-slate-500">작성자</label>
                            <select id="agenda-author" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500 transition-all bg-white">
                                ${users.map(u => `<option value="${u.full_name}">${u.full_name}</option>`).join('')}
                            </select>
                        </div>
                        <div class="space-y-1 md:col-span-2">
                            <label class="text-xs font-bold text-slate-500">상세 설명</label>
                            <textarea id="agenda-description" rows="3" placeholder="안건의 상세 내용이나 배경 정보를 입력하세요..." class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500 transition-all"></textarea>
                        </div>
                    </div>
                    <div class="flex justify-end gap-2 pt-2">
                        <button type="button" onclick="hideAgendaForm()" class="px-4 py-2 rounded-lg font-bold text-slate-500 hover:bg-slate-100 transition-all">취소</button>
                        <button type="submit" class="bg-brand-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-brand-700 transition-all">저장하기</button>
                    </div>
                </form>
            </div>

            <div class="grid grid-cols-1 gap-4">
                ${agendas.length === 0 ? `
                    <div class="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
                        <p class="text-slate-400">등록된 안건이 없습니다. 새로운 안건을 추가해 보세요!</p>
                    </div>
                ` : agendas.map(a => {
        const m = meetings.find(m => m.id == a.meetingId);
        return `
                        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between group hover:border-brand-500/30 transition-all">
                            <div class="flex items-center gap-5">
                                <div class="w-10 h-10 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center">
                                    <i data-lucide="check-square" class="w-5 h-5"></i>
                                </div>
                                <div>
                                    <div class="flex items-center gap-2">
                                        <h4 class="font-bold text-slate-800">${a.title}</h4>
                                        <span class="text-[10px] text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">${m ? m.title : '미지정 회의'}</span>
                                    </div>
                                    <div class="flex items-center gap-2 mt-0.5">
                                        <span class="text-[10px] text-brand-600 font-medium">${a.author || '미지정'}</span>
                                        <span class="text-slate-300">•</span>
                                        <span class="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-500 font-medium">${a.status || '대기중'}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                <button onclick="editAgenda(${a.id})" class="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-all">
                                    <i data-lucide="edit-3" class="w-5 h-5"></i>
                                </button>
                                <button onclick="deleteAgenda(${a.id})" class="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all">
                                    <i data-lucide="trash-2" class="w-5 h-5"></i>
                                </button>
                            </div>
                        </div>
                    `;
    }).join('')}
            </div>
        </div>
    `,
    users: () => `
        <div class="space-y-8">
            <header class="flex justify-between items-center">
                <div>
                    <h2 class="text-3xl font-bold text-slate-900 mb-1">사용자 관리</h2>
                    <p class="text-slate-500">시스템 사용자 및 권한을 관리하세요.</p>
                </div>
                <button onclick="showUserForm()" class="bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-lg shadow-brand-500/20">
                    <i data-lucide="user-plus" class="w-4 h-4"></i>
                    사용자 등록하기
                </button>
            </header>

            <div id="user-form-container" class="hidden bg-white p-6 rounded-2xl border-2 border-brand-500/20 shadow-xl mb-8">
                <h3 id="user-form-title" class="text-lg font-bold text-brand-700 mb-4">사용자 정보</h3>
                <form id="user-form" onsubmit="handleUserSubmit(event)" class="space-y-4">
                    <input type="hidden" id="user-id">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="space-y-1">
                            <label class="text-xs font-bold text-slate-500">이름</label>
                            <input type="text" id="user-name" required class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500 transition-all">
                        </div>
                        <div class="space-y-1">
                            <label class="text-xs font-bold text-slate-500">이메일</label>
                            <input type="email" id="user-email" required class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500 transition-all">
                        </div>
                        <div class="space-y-1">
                            <label class="text-xs font-bold text-slate-500">권한</label>
                            <select id="user-role" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500 transition-all bg-white">
                                <option value="일반 사용자">일반 사용자</option>
                                <option value="결정 위원">결정 위원</option>
                                <option value="관리자">관리자</option>
                            </select>
                        </div>
                    </div>
                    <div class="flex justify-end gap-2 pt-2">
                        <button type="button" onclick="hideUserForm()" class="px-4 py-2 rounded-lg font-bold text-slate-500 hover:bg-slate-100 transition-all">취소</button>
                        <button type="submit" class="bg-brand-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-brand-700 transition-all">저장하기</button>
                    </div>
                </form>
            </div>

            <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <table class="w-full text-left border-collapse">
                    <thead class="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase">사용자</th>
                            <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase">이메일</th>
                            <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase">권한</th>
                            <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase">관리</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        ${users.map(u => `
                            <tr class="hover:bg-slate-50 transition-all">
                                <td class="px-6 py-4">
                                    <div class="flex items-center gap-3">
                                        <div class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">${u.full_name ? u.full_name.charAt(0) : '?'}</div>
                                        <span class="font-bold text-slate-800">${u.full_name}</span>
                                    </div>
                                </td>
                                <td class="px-6 py-4 text-sm text-slate-600">${u.email}</td>
                                <td class="px-6 py-4">
                                    <span class="px-2.5 py-1 rounded-full text-[11px] font-bold ${u.role === '관리자' ? 'bg-purple-50 text-purple-600' : u.role === '결정 위원' ? 'bg-amber-50 text-amber-600' : 'bg-slate-50 text-slate-600'}">
                                        ${u.role}
                                    </span>
                                </td>
                                <td class="px-6 py-4">
                                    <div class="flex items-center gap-2">
                                        <button onclick="editUser(${u.id})" class="p-2 text-slate-400 hover:text-brand-600 transition-all">
                                            <i data-lucide="settings" class="w-4 h-4"></i>
                                        </button>
                                        <button onclick="deleteUser(${u.id})" class="p-2 text-slate-400 hover:text-rose-600 transition-all">
                                            <i data-lucide="trash-2" class="w-4 h-4"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `
};

// --- 3. Functional Components (Attached to Window) ---
window.navigateTo = (viewId, data = null) => {
    console.log('Navigating to:', viewId);
    if (!views[viewId]) {
        console.error('View not found:', viewId);
        return;
    }

    const ca = document.getElementById('content-area');
    if (!ca) {
        console.error('Content area not found!');
        return;
    }

    try {
        // Fade out
        ca.style.opacity = '0';
        ca.style.transform = 'translateY(10px)';

        setTimeout(() => {
            try {
                ca.innerHTML = views[viewId](data);
                if (window.lucide) {
                    window.lucide.createIcons();
                } else {
                    console.warn('Lucide not available for dynamic content');
                }

                // Update active state in sidebar
                document.querySelectorAll('aside nav a').forEach(link => {
                    link.classList.remove('sidebar-item-active', 'bg-brand-50', 'text-brand-700');
                    if (link.id === `nav-${viewId}`) {
                        link.classList.add('sidebar-item-active');
                    }
                });

                // Fade in
                ca.style.opacity = '1';
                ca.style.transform = 'translateY(0)';
            } catch (renderError) {
                console.error('Rendering error:', renderError);
                ca.innerHTML = `<div class="p-10 text-rose-600 bg-rose-50 rounded-2xl border border-rose-100">
                    <h2 class="text-xl font-bold mb-2">화면 로딩 오류</h2>
                    <p>${renderError.message}</p>
                </div>`;
                ca.style.opacity = '1';
            }
        }, 150);
    } catch (e) {
        console.error('Navigation transition error:', e);
    }
};

window.toggleMeetingAgendas = (id) => {
    expandedMeetingId = (expandedMeetingId === id) ? null : id;
    window.navigateTo('meetings');
};

window.showToast = (message, type = 'success') => {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast-notification glass px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border-l-4 ${type === 'success' ? 'border-brand-500' : 'border-rose-500'} bg-white`;

    toast.innerHTML = `
        <i data-lucide="${type === 'success' ? 'check-circle' : 'alert-circle'}" class="w-5 h-5 ${type === 'success' ? 'text-brand-500' : 'text-rose-500'}"></i>
        <span class="text-sm font-bold text-slate-700">${message}</span>
    `;

    container.appendChild(toast);
    if (window.lucide) { window.lucide.createIcons(); }

    setTimeout(() => {
        toast.classList.add('hide');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
};

window.handleMeetingCreate = (e) => {
    e.preventDefault();
    const title = document.getElementById('m-title').value;
    const dateRaw = document.getElementById('m-date').value;
    const location = document.getElementById('m-location').value;
    const date = dateRaw.replace('T', ' ');

    const newId = meetings.length > 0 ? Math.max(...meetings.map(m => m.id)) + 1 : 1;
    meetings.push({ id: newId, title, date, location, status: '예정됨' });

    window.showToast('회의가 등록되었습니다.');
    window.navigateTo('meetings');
};

window.showAgendaForm = (isEdit = false, meetingId = null) => {
    const container = document.getElementById('agenda-form-container');
    if (!container) {
        window.navigateTo('agendas');
        setTimeout(() => window.showAgendaForm(isEdit, meetingId), 200);
        return;
    }
    container.classList.remove('hidden');
    document.getElementById('form-title').innerText = isEdit ? '안건 수정' : '새 안건 작성';

    if (!isEdit) {
        document.getElementById('agenda-form').reset();
        document.getElementById('agenda-id').value = '';
        document.getElementById('agenda-description').value = '';
        if (meetingId) {
            document.getElementById('agenda-meeting-id').value = meetingId;
        }
    }
};

window.hideAgendaForm = () => {
    const el = document.getElementById('agenda-form-container');
    if (el) el.classList.add('hidden');
};

window.handleAgendaSubmit = (e) => {
    e.preventDefault();
    const id = document.getElementById('agenda-id').value;
    const meetingId = parseInt(document.getElementById('agenda-meeting-id').value);
    const title = document.getElementById('agenda-title').value;
    const author = document.getElementById('agenda-author').value;
    const description = document.getElementById('agenda-description').value;

    if (id) {
        const index = agendas.findIndex(a => a.id == id);
        agendas[index] = { ...agendas[index], meetingId, title, author, description };
    } else {
        const newId = agendas.length > 0 ? Math.max(...agendas.map(a => a.id)) + 1 : 1;
        agendas.push({ id: newId, meetingId, title, author, description, status: '예정됨', reviews: [] });
    }
    window.hideAgendaForm();
    window.showToast(id ? '안건이 수정되었습니다.' : '안건이 등록되었습니다.');

    if (expandedMeetingId) {
        window.navigateTo('meetings');
    } else {
        window.navigateTo('agendas');
    }
};

window.editAgenda = (id) => {
    const item = agendas.find(a => a.id === id);
    if (item) {
        window.showAgendaForm(true, item.meetingId);
        document.getElementById('agenda-id').value = item.id;
        document.getElementById('agenda-title').value = item.title;
        document.getElementById('agenda-author').value = item.author || 'Jane Doe';
        document.getElementById('agenda-description').value = item.description || '';
    }
};

window.deleteAgenda = (id) => {
    if (confirm('정말로 이 안건을 삭제하시겠습니까?')) {
        agendas = agendas.filter(a => a.id !== id);
        window.showToast('안건이 삭제되었습니다.');
        if (expandedMeetingId) {
            window.navigateTo('meetings');
        } else {
            window.navigateTo('agendas');
        }
    }
};

window.handleReviewSubmit = (agendaId) => {
    const input = document.getElementById(`review-input-${agendaId}`);
    if (!input) return;
    const comment = input.value.trim();
    if (!comment) return;

    const agenda = agendas.find(a => a.id === agendaId);
    if (agenda) {
        if (!agenda.reviews) agenda.reviews = [];
        agenda.reviews.push({
            user: 'Alice Wong',
            role: '결정 위원',
            comment: comment,
            date: new Date().toISOString().split('T')[0].replace(/-/g, '.')
        });
        input.value = '';
        window.showToast('검토 의견이 등록되었습니다.');
        if (expandedMeetingId) {
            window.navigateTo('meetings');
        } else {
            window.navigateTo('agendas');
        }
    }
};

window.showUserForm = (isEdit = false) => {
    const container = document.getElementById('user-form-container');
    if (container) {
        container.classList.remove('hidden');
        document.getElementById('user-form-title').innerText = isEdit ? '사용자 권한 수정' : '신규 사용자 등록';
        if (!isEdit) {
            document.getElementById('user-form').reset();
            document.getElementById('user-id').value = '';
        }
    }
};

window.hideUserForm = () => {
    const el = document.getElementById('user-form-container');
    if (el) el.classList.add('hidden');
};

window.handleUserSubmit = (e) => {
    e.preventDefault();
    const id = document.getElementById('user-id').value;
    const full_name = document.getElementById('user-name').value;
    const email = document.getElementById('user-email').value;
    const role = document.getElementById('user-role').value;

    if (id) {
        const index = users.findIndex(u => u.id == id);
        users[index] = { ...users[index], full_name, email, role };
    } else {
        const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
        users.push({ id: newId, full_name, email, role });
    }
    window.hideUserForm();
    window.showToast(id ? '사용자 정보가 수정되었습니다.' : '사용자가 등록되었습니다.');
    window.navigateTo('users');
};

window.editUser = (id) => {
    const user = users.find(u => u.id === id);
    if (user) {
        window.showUserForm(true);
        document.getElementById('user-id').value = user.id;
        document.getElementById('user-name').value = user.full_name;
        document.getElementById('user-email').value = user.email;
        document.getElementById('user-role').value = user.role;
    }
};

window.deleteUser = (id) => {
    if (confirm('정말로 이 사용자를 삭제하시겠습니까?')) {
        users = users.filter(u => u.id !== id);
        window.showToast('사용자가 삭제되었습니다.');
        window.navigateTo('users');
    }
};

// --- 4. Initialization ---
function initApp() {
    console.log('경영집행위원회 App Initializing...');
    if (window.navigateTo) {
        window.navigateTo('dashboard');
    } else {
        console.error('navigateTo function not found!');
    }
}

// Global error handler
window.onerror = function (message, source, lineno, colno, error) {
    console.error('GLOBAL ERROR:', message, 'at', source, ':', lineno);
    const ca = document.getElementById('content-area');
    if (ca) {
        ca.innerHTML = `<div class="p-10 text-rose-600 bg-rose-50 rounded-2xl border border-rose-100">
            <h2 class="text-xl font-bold mb-2">애플리케이션 실행 오류</h2>
            <p>${message}</p>
        </div>`;
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
