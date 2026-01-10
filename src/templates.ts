export const Layout = (content: string) => `
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
        <span class="inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${getPriorityStyle(email.priority)}">
            ${email.priority}
        </span>
    </td>
    <td class="px-6 py-4 whitespace-nowrap">
        <span class="inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${getCategoryStyle(email.category)}">
            ${email.category}
        </span>
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
