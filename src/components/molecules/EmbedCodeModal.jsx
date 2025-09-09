import React, { useState } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import Modal from "@/components/organisms/Modal";

const EmbedCodeModal = ({ isOpen, onClose, form }) => {
  const [embedType, setEmbedType] = useState("inline")
  const [copied, setCopied] = useState(false)

  if (!form) return null

  const generateEmbedCode = () => {
    const baseUrl = window.location.origin
    const formUrl = `${baseUrl}/api/forms/${form.Id}/embed`
    
    switch (embedType) {
      case "inline":
return `<!-- AgencyFlow Proposal Template Embed -->
<div id="agencyflow-template-${form.Id}"></div>
<script>
(function() {
  var script = document.createElement('script');
  script.src = '${baseUrl}/embed.js';
  script.setAttribute('data-template-id', '${form.Id}');
  script.setAttribute('data-theme', '${form.settings?.theme || 'professional'}');
  script.setAttribute('data-type', 'proposal');
  document.head.appendChild(script);
})();
</script>`

      case "iframe":
        return `<!-- AgencyFlow Proposal Template iFrame -->
<iframe 
  src="${formUrl}" 
  width="100%" 
  height="800" 
  frameborder="0" 
  style="border: none; border-radius: 8px;"
  title="${form.name}">
</iframe>`

      case "popup":
        return `<!-- AgencyFlow Popup Proposal -->
<button onclick="openAgencyFlowProposal('${form.Id}')" style="
  background: linear-gradient(135deg, ${form.branding?.primaryColor || '#4F46E5'}, ${form.branding?.secondaryColor || '#7C3AED'});
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: transform 0.2s;
" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
  ${form.settings?.submitText || 'View Proposal'}
</button>
<script>
function openAgencyFlowProposal(templateId) {
  var popup = window.open('${formUrl}?popup=true', 'agencyflow-proposal', 'width=800,height=900,scrollbars=yes,resizable=yes');
  popup.focus();
}
</script>`

      case "redirect":
        return `<!-- AgencyFlow Proposal Template Redirect -->
<a href="${formUrl}" target="_blank" style="
  display: inline-block;
  background: linear-gradient(135deg, ${form.branding?.primaryColor || '#4F46E5'}, ${form.branding?.secondaryColor || '#7C3AED'});
  color: white;
  text-decoration: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-weight: 500;
  transition: transform 0.2s;
" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
  ${form.settings?.submitText || 'View Proposal'} →
</a>`

      default:
        return ""
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateEmbedCode())
      setCopied(true)
      toast.success("Embed code copied to clipboard!")
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error("Failed to copy embed code")
    }
  }

  const embedOptions = [
    { value: "inline", label: "Inline Embed", description: "Embeds the form directly in your page" },
    { value: "iframe", label: "iFrame Embed", description: "Loads the form in an iframe" },
    { value: "popup", label: "Popup Modal", description: "Opens the form in a popup window" },
    { value: "redirect", label: "External Link", description: "Links to the form on a separate page" }
  ]

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Embed Form Code">
    <div className="space-y-6">
        {/* Form Info */}
        <div
            className="bg-gradient-to-r from-indigo-50 via-purple-50 to-blue-50 p-6 rounded-xl border border-indigo-200/60">
            <h4 className="font-bold text-slate-900 mb-2">{form.name}</h4>
            <p className="text-sm text-slate-600">
                {form.fields?.length || 0}fields • Created {new Date(form.createdAt || Date.now()).toLocaleDateString()}
            </p>
        </div>
        {/* Embed Type Selection */}
        <div
            className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-6 border border-slate-200/60">
            <label className="block text-sm font-semibold text-slate-700 mb-3">Embed Type
                          </label>
            <Select
                value={embedType}
                onChange={e => setEmbedType(e.target.value)}
                className="bg-white/80">
                {embedOptions.map(option => <option key={option.value} value={option.value}>
                    {option.label}
                </option>)}
            </Select>
            <p className="text-xs text-slate-500 mt-3 italic leading-relaxed">
                {embedOptions.find(opt => opt.value === embedType)?.description}
            </p>
        </div>
        {/* Generated Code */}
        <div
            className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 rounded-xl p-6 border border-slate-700/50">
            <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-semibold text-white flex items-center">
                    <div
                        className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mr-2 shadow-sm">
                        <ApperIcon name="Code" className="w-3 h-3 text-white" />
                    </div>Generated Embed Code
                                </label>
                <Button
                    size="sm"
                    variant="secondary"
                    onClick={copyToClipboard}
                    icon={copied ? "Check" : "Copy"}
                    className="bg-white/10 backdrop-blur-sm text-white border-white/20 hover:bg-white/20">
                    {copied ? "Copied!" : "Copy Code"}
                </Button>
            </div>
            <div className="relative">
                <pre
                    className="bg-black/50 backdrop-blur-sm text-green-400 p-6 rounded-xl text-xs overflow-x-auto max-h-80 overflow-y-auto border border-slate-700/50 shadow-inner">
                    <code>{generateEmbedCode()}</code>
                </pre>
            </div>
        </div>
    </div>
    {/* Instructions */}
    <div
        className="bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 border border-blue-200/60 rounded-xl p-6">
        <h5 className="font-bold text-blue-900 mb-4 flex items-center">
            <div
                className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-2 shadow-sm">
                <ApperIcon name="Info" className="w-3 h-3 text-white" />
            </div>Integration Instructions
                      </h5>
        <div className="text-sm text-blue-800 space-y-3">
            {embedType === "inline" && <div className="space-y-2">
                <p className="font-medium">1. Copy the code above</p>
                <p>2. Paste it into your HTML where you want the form to appear</p>
                <p>3. The form will automatically load and match your site's styling</p>
            </div>}
            {embedType === "iframe" && <div className="space-y-2">
                <p className="font-medium">1. Copy the iframe code above</p>
                <p>2. Paste it into your HTML</p>
                <p>3. Adjust width and height as needed for your layout</p>
            </div>}
            {embedType === "popup" && <div className="space-y-2">
                <p className="font-medium">1. Copy the button code above</p>
                <p>2. Paste it into your HTML</p>
                <p>3. Clicking the button will open the form in a popup window</p>
            </div>}
            {embedType === "redirect" && <div className="space-y-2">
                <p className="font-medium">1. Copy the link code above</p>
                <p>2. Paste it into your HTML</p>
                <p>3. Visitors will be redirected to a dedicated form page</p>
            </div>}
        </div>
    </div>
    {/* Form Analytics Note */}
    <div
        className="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 border border-emerald-200/60 rounded-xl p-6">
        <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
                <div
                    className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <ApperIcon name="CheckCircle" className="w-4 h-4 text-white" />
                </div>
            </div>
            <div>
                <h5 className="font-bold text-emerald-900 mb-2">Analytics Included</h5>
                <p className="text-sm text-emerald-800 leading-relaxed">All form submissions are automatically tracked in your AgencyFlow dashboard. 
                                    You'll receive email notifications for new submissions.
                                  </p>
            </div>
        </div>
    </div></Modal>
  )
}

export default EmbedCodeModal