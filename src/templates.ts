export const Layout = (content: string, isAuthenticated: boolean = true, authUrl: string = "") => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gmail Ingestion Dashboard</title>
    <script src="https://unpkg.com/htmx.org@1.9.10"></script>
    <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; }
        /* Custom scrollbar for webkit */
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
    </style>
</head>
<body class="bg-gray-50 text-slate-800 antialiased min-h-screen">
    ${isAuthenticated ? `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div class="flex justify-between items-center mb-8">
            <div>
                <h1 class="text-3xl font-bold tracking-tight text-slate-900">Inbox Zero</h1>
                <p class="text-sm text-slate-500 mt-1">Manage your incoming emails efficiently</p>
            </div>
            <div class="flex gap-4 items-center">
             <div id="status-msg" class="text-sm text-slate-500 transition-opacity duration-300"></div>
            </div>
            </div>
        </div>
        


        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50/50">
                        <tr>
                            <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-16 text-center">
                                Done
                            </th>
                            <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-40">
                                Received
                            </th>
                            <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-28">
                                Priority
                            </th>
                            <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-32">
                                Category
                            </th>
                             <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-24">
                                Order #
                            </th>
                            <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-32">
                                Address
                            </th>
                            <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-48">
                                Sender
                            </th>
                            <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Subject
                            </th>
                            <th scope="col" class="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider w-24">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody id="email-list-body" class="divide-y divide-gray-100 bg-white" hx-get="/emails" hx-trigger="every 5s" hx-swap="innerHTML">
                        ${content}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    ` : `
    <div class="min-h-screen flex items-center justify-center px-4">
        <div class="max-w-md w-full">
            <div class="text-center mb-8">
                <h1 class="text-4xl font-bold tracking-tight text-slate-900 mb-2">Inbox Zero</h1>
                <p class="text-slate-600">Manage your Gmail efficiently with AI-powered insights</p>
            </div>
            
            <div class="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
                <div class="text-center mb-6">
                    <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mb-4">
                        <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                        </svg>
                    </div>
                    <h2 class="text-2xl font-bold text-slate-900 mb-2">Welcome Back</h2>
                    <p class="text-slate-600 text-sm">Sign in with your Google account to access your email dashboard</p>
                </div>
                
                <div class="space-y-4 mb-6">
                    <div class="flex items-start gap-3 text-sm text-slate-600">
                        <svg class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                        </svg>
                        <span>AI-powered email categorization and priority detection</span>
                    </div>
                    <div class="flex items-start gap-3 text-sm text-slate-600">
                        <svg class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                        </svg>
                        <span>Automatic extraction of order numbers and addresses</span>
                    </div>
                    <div class="flex items-start gap-3 text-sm text-slate-600">
                        <svg class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                        </svg>
                        <span>Real-time email synchronization and updates</span>
                    </div>
                </div>
                
                <a href="${authUrl}" 
                   class="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3.5 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                    <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="white"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="white"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="white"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="white"/>
                    </svg>
                    <span>Sign in with Google</span>
                </a>
                
                <p class="text-xs text-slate-500 text-center mt-4">
                    By signing in, you agree to allow this app to access your Gmail in read-only mode
                </p>
            </div>
        </div>
    </div>
    `}
</body>
</html>
`;

export const EmailRow = (email: any) => {
    const getPriorityStyle = (p: string) => {
        switch(p?.toLowerCase()) {
            case 'high': return 'bg-red-50 text-red-700 ring-red-600/20';
            case 'medium': return 'bg-orange-50 text-orange-700 ring-orange-600/20';
            case 'low': return 'bg-emerald-50 text-emerald-700 ring-emerald-600/20';
            default: return 'bg-gray-50 text-gray-600 ring-gray-500/20';
        }
    };

    const getCategoryStyle = (c: string) => {
         switch(c?.toLowerCase()) {
            case 'work': return 'bg-blue-50 text-blue-700 ring-blue-700/10';
            case 'personal': return 'bg-violet-50 text-violet-700 ring-violet-700/10';
            case 'finance': return 'bg-amber-50 text-amber-700 ring-amber-700/10';
            case 'social': return 'bg-pink-50 text-pink-700 ring-pink-700/10';
            case 'promotions': return 'bg-cyan-50 text-cyan-700 ring-cyan-700/10';
            default: return 'bg-slate-50 text-slate-600 ring-slate-500/10';
        }
    }

    return `
<tr id="email-${email.id}" class="group hover:bg-gray-50/80 transition-all duration-200 ${email.resolved ? 'bg-gray-50' : ''}">
    <td class="px-6 py-4 whitespace-nowrap text-center">
        <div class="flex items-center justify-center">
            <input type="checkbox" 
                class="w-5 h-5 text-slate-900 border-gray-300 rounded focus:ring-slate-900 cursor-pointer transition-all checked:bg-slate-900 checked:border-transparent"
                ${email.resolved ? 'checked' : ''}
                hx-post="/emails/${email.id}/resolve"
                hx-target="#email-${email.id}"
                hx-swap="outerHTML"
            >
        </div>
    </td>
    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <div class="flex flex-col gap-0.5">
            <span class="font-medium text-slate-700">${new Date(email.ingestedAt).toLocaleDateString(undefined, {month:'short', day:'numeric'})}</span>
            <span class="text-xs text-slate-400 font-medium">${new Date(email.ingestedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
        </div>
    </td>
    <td class="px-6 py-4 whitespace-nowrap">
        <div class="flex flex-col gap-1 items-start">
            <span class="inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${getPriorityStyle(email.priority)}">
                ${email.priority}
            </span>
            ${email.quoteRequest ? '<span class="inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-medium bg-purple-50 text-purple-700 ring-1 ring-inset ring-purple-700/10">Quote Req</span>' : ''}
        </div>
    </td>
    <td class="px-6 py-4 whitespace-nowrap">
        <span class="inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${getCategoryStyle(email.category)}">
            ${email.category}
        </span>
    </td>
     <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
        ${email.orderNo ? `<span class="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-xs text-slate-700 select-all">${email.orderNo}</span>` : '<span class="text-gray-300">-</span>'}
    </td>
    <td class="px-6 py-4 text-sm text-slate-600">
        <div class="truncate max-w-[10rem]" title="${email.address || ''}">
            ${email.address || '<span class="text-gray-300">-</span>'}
        </div>
    </td>
    <td class="px-6 py-4 text-sm text-slate-600">
        <div class="truncate max-w-[14rem] font-medium" title="${email.sender}">
            ${email.sender.replace(/<.*>/, '').trim()}
        </div>
        <div class="text-xs text-slate-400 truncate max-w-[14rem]">
             ${(email.sender.match(/<([^>]+)>/) || [])[1] || ''}
        </div>
    </td>
    <td class="px-6 py-4 text-sm text-slate-700">
        <div class="line-clamp-2 leading-relaxed font-medium ${email.resolved ? 'text-gray-400 line-through decoration-gray-300' : ''}">
            ${email.subject}
        </div>
        ${email.aiSummary ? `<div class="mt-1 text-xs text-indigo-600 font-medium bg-indigo-50 inline-block px-1.5 py-0.5 rounded border border-indigo-100">✨ ${email.aiSummary}</div>` : ''}
    </td>
    <td class="px-6 py-4 whitespace-nowrap text-right text-sm">
        <a href="${email.link}" target="_blank" class="group/link inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-slate-600 hover:text-slate-900 hover:bg-white hover:shadow-sm hover:ring-1 hover:ring-gray-200 transition-all font-medium">
            <span>Open</span>
            <svg class="w-3.5 h-3.5 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
        </a>
    </td>
</tr>
`;
};
