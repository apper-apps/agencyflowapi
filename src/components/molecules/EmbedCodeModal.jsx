import React, { useState } from "react"
import Modal from "@/components/organisms/Modal"
import Button from "@/components/atoms/Button"
import Select from "@/components/atoms/Select"
import { toast } from "react-toastify"

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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Embed Form Code"
    >
      <div className="space-y-6">
        {/* Form Info */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-1">{form.name}</h4>
          <p className="text-sm text-gray-600">
            {form.fields?.length || 0} fields • Created {new Date(form.createdAt || Date.now()).toLocaleDateString()}
          </p>
        </div>

        {/* Embed Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Embed Type
          </label>
          <Select
            value={embedType}
            onChange={(e) => setEmbedType(e.target.value)}
          >
            {embedOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
          <p className="text-xs text-gray-500 mt-1">
            {embedOptions.find(opt => opt.value === embedType)?.description}
          </p>
        </div>

        {/* Generated Code */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Generated Embed Code
            </label>
            <Button
              size="sm"
              variant="secondary"
              onClick={copyToClipboard}
              icon={copied ? "Check" : "Copy"}
            >
              {copied ? "Copied!" : "Copy Code"}
            </Button>
          </div>
          
          <div className="relative">
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-xs overflow-x-auto max-h-64 overflow-y-auto">
              <code>{generateEmbedCode()}</code>
            </pre>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h5 className="font-medium text-blue-900 mb-2">Integration Instructions</h5>
          <div className="text-sm text-blue-800 space-y-2">
            {embedType === "inline" && (
              <div>
                <p>1. Copy the code above</p>
                <p>2. Paste it into your HTML where you want the form to appear</p>
                <p>3. The form will automatically load and match your site's styling</p>
              </div>
            )}
            
            {embedType === "iframe" && (
              <div>
                <p>1. Copy the iframe code above</p>
                <p>2. Paste it into your HTML</p>
                <p>3. Adjust width and height as needed for your layout</p>
              </div>
            )}
            
            {embedType === "popup" && (
              <div>
                <p>1. Copy the button code above</p>
                <p>2. Paste it into your HTML</p>
                <p>3. Clicking the button will open the form in a popup window</p>
              </div>
            )}
            
            {embedType === "redirect" && (
              <div>
                <p>1. Copy the link code above</p>
                <p>2. Paste it into your HTML</p>
                <p>3. Visitors will be redirected to a dedicated form page</p>
              </div>
            )}
          </div>
        </div>

        {/* Form Analytics Note */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <div className="flex-shrink-0">
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
            </div>
            <div>
              <h5 className="font-medium text-green-900 mb-1">Analytics Included</h5>
              <p className="text-sm text-green-800">
                All form submissions are automatically tracked in your AgencyFlow dashboard. 
                You'll receive email notifications for new submissions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default EmbedCodeModal