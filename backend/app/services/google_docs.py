"""Google Docs service for CV export."""
from typing import Dict, Any, Optional, List
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError


class GoogleDocsService:
    """Service for creating and formatting Google Docs."""

    def __init__(self, credentials: Credentials):
        """Initialize with Google credentials."""
        self.docs_service = build('docs', 'v1', credentials=credentials)
        self.drive_service = build('drive', 'v3', credentials=credentials)

    def create_cv_document(self, cv_data: Dict[str, Any]) -> Dict[str, str]:
        """
        Create a Google Doc with CV data.

        Returns:
            Dict with document ID and URL
        """
        try:
            # Create document
            profile = cv_data.get('profile', {})
            title = f"CV - {profile.get('first_name', 'User')} {profile.get('last_name', '')}"

            document = self.docs_service.documents().create(body={
                'title': title
            }).execute()

            doc_id = document['documentId']

            # Format the document
            self._format_cv_document(doc_id, cv_data)

            # Get document URL
            doc_url = f"https://docs.google.com/document/d/{doc_id}/edit"

            return {
                'document_id': doc_id,
                'document_url': doc_url,
                'success': True
            }

        except HttpError as error:
            raise Exception(f"Error creating Google Doc: {error}")

    def _format_cv_document(self, doc_id: str, cv_data: Dict[str, Any]):
        """Format the CV document with proper styling."""
        requests = []

        # Build content first
        content_requests = self._build_cv_content(cv_data)

        # Apply all requests
        if content_requests:
            self.docs_service.documents().batchUpdate(
                documentId=doc_id,
                body={'requests': content_requests}
            ).execute()

    def _build_cv_content(self, cv_data: Dict[str, Any]) -> List[Dict]:
        """Build the CV content with formatting."""
        requests = []
        index = 1  # Start after title

        profile = cv_data.get('profile', {})
        education = cv_data.get('education', [])
        experience = cv_data.get('experience', [])
        projects = cv_data.get('projects', [])
        certifications = cv_data.get('certifications', [])
        skills = cv_data.get('skills')

        # Header - Name
        name_text = f"{profile.get('first_name', '')} {profile.get('last_name', '')}\n"
        requests.append({
            'insertText': {
                'location': {'index': index},
                'text': name_text
            }
        })

        # Style name as bold, large, centered
        name_length = len(name_text) - 1
        requests.extend([
            {
                'updateParagraphStyle': {
                    'range': {'startIndex': index, 'endIndex': index + name_length},
                    'paragraphStyle': {
                        'namedStyleType': 'HEADING_1',
                        'alignment': 'CENTER'
                    },
                    'fields': 'namedStyleType,alignment'
                }
            },
            {
                'updateTextStyle': {
                    'range': {'startIndex': index, 'endIndex': index + name_length},
                    'textStyle': {
                        'bold': True,
                        'fontSize': {'magnitude': 24, 'unit': 'PT'}
                    },
                    'fields': 'bold,fontSize'
                }
            }
        ])
        index += len(name_text)

        # Contact Info
        contact_parts = []
        if profile.get('email'):
            contact_parts.append(profile['email'])
        if profile.get('phone'):
            contact_parts.append(profile['phone'])
        if profile.get('location'):
            contact_parts.append(profile['location'])
        if profile.get('linkedin'):
            contact_parts.append(profile['linkedin'])

        if contact_parts:
            contact_text = ' • '.join(contact_parts) + '\n'
            requests.extend([
                {'insertText': {'location': {'index': index}, 'text': contact_text}},
                {'updateParagraphStyle': {
                    'range': {'startIndex': index, 'endIndex': index + len(contact_text)},
                    'paragraphStyle': {'alignment': 'CENTER'},
                    'fields': 'alignment'
                }}
            ])
            index += len(contact_text)

        # Horizontal line
        requests.append({'insertText': {'location': {'index': index}, 'text': '\n'}})
        index += 1

        # Summary
        if profile.get('summary'):
            summary_text = profile['summary'] + '\n\n'
            requests.append({'insertText': {'location': {'index': index}, 'text': summary_text}})
            index += len(summary_text)

        # Education Section
        if education:
            section_requests, new_index = self._add_section(
                'EDUCATION', education, index, 'education'
            )
            requests.extend(section_requests)
            index = new_index

        # Experience Section
        if experience:
            section_requests, new_index = self._add_section(
                'EXPERIENCE', experience, index, 'experience'
            )
            requests.extend(section_requests)
            index = new_index

        # Projects Section
        if projects:
            section_requests, new_index = self._add_section(
                'PROJECTS', projects, index, 'projects'
            )
            requests.extend(section_requests)
            index = new_index

        # Certifications Section
        if certifications:
            section_requests, new_index = self._add_section(
                'CERTIFICATIONS', certifications, index, 'certifications'
            )
            requests.extend(section_requests)
            index = new_index

        # Skills Section
        if skills:
            section_requests, new_index = self._add_skills_section(skills, index)
            requests.extend(section_requests)
            index = new_index

        return requests

    def _add_section(self, title: str, items: List[Dict], index: int, section_type: str) -> tuple:
        """Add a section with items."""
        requests = []

        # Section title
        title_text = f"{title}\n"
        requests.extend([
            {'insertText': {'location': {'index': index}, 'text': title_text}},
            {
                'updateTextStyle': {
                    'range': {'startIndex': index, 'endIndex': index + len(title_text) - 1},
                    'textStyle': {
                        'bold': True,
                        'fontSize': {'magnitude': 13, 'unit': 'PT'}
                    },
                    'fields': 'bold,fontSize'
                }
            }
        ])
        index += len(title_text)

        # Underline
        line_text = '─' * 80 + '\n'
        requests.append({'insertText': {'location': {'index': index}, 'text': line_text}})
        index += len(line_text)

        # Add items
        for item in items:
            item_requests, new_index = self._format_item(item, index, section_type)
            requests.extend(item_requests)
            index = new_index

        # Add spacing
        requests.append({'insertText': {'location': {'index': index}, 'text': '\n'}})
        index += 1

        return requests, index

    def _format_item(self, item: Dict, index: int, item_type: str) -> tuple:
        """Format an individual item based on type."""
        requests = []

        if item_type == 'education':
            # Institution and location
            header = f"{item.get('institution', '')} — {item.get('location', '')}"
            date_range = self._format_date_range(item.get('start_date'), item.get('end_date'))
            header_text = f"{header}".ljust(80 - len(date_range)) + f"{date_range}\n"

            requests.extend([
                {'insertText': {'location': {'index': index}, 'text': header_text}},
                {'updateTextStyle': {
                    'range': {'startIndex': index, 'endIndex': index + len(item.get('institution', ''))},
                    'textStyle': {'bold': True},
                    'fields': 'bold'
                }}
            ])
            index += len(header_text)

            # Degree
            if item.get('degree'):
                degree_text = f"{item['degree']}\n"
                requests.extend([
                    {'insertText': {'location': {'index': index}, 'text': degree_text}},
                    {'updateTextStyle': {
                        'range': {'startIndex': index, 'endIndex': index + len(degree_text) - 1},
                        'textStyle': {'italic': True},
                        'fields': 'italic'
                    }}
                ])
                index += len(degree_text)

        elif item_type == 'experience':
            # Company and location
            header = f"{item.get('company', '')} — {item.get('location', '')}"
            date_range = self._format_date_range(item.get('start_date'), item.get('end_date'))
            header_text = f"{header}".ljust(80 - len(date_range)) + f"{date_range}\n"

            requests.extend([
                {'insertText': {'location': {'index': index}, 'text': header_text}},
                {'updateTextStyle': {
                    'range': {'startIndex': index, 'endIndex': index + len(item.get('company', ''))},
                    'textStyle': {'bold': True},
                    'fields': 'bold'
                }}
            ])
            index += len(header_text)

            # Role
            if item.get('role'):
                role_text = f"{item['role']}\n"
                requests.extend([
                    {'insertText': {'location': {'index': index}, 'text': role_text}},
                    {'updateTextStyle': {
                        'range': {'startIndex': index, 'endIndex': index + len(role_text) - 1},
                        'textStyle': {'italic': True},
                        'fields': 'italic'
                    }}
                ])
                index += len(role_text)

            # Bullets
            if item.get('bullets'):
                for bullet in item['bullets']:
                    bullet_text = f"  • {bullet}\n"
                    requests.append({'insertText': {'location': {'index': index}, 'text': bullet_text}})
                    index += len(bullet_text)

        elif item_type == 'projects':
            project_text = f"{item.get('name', '')}\n"
            requests.extend([
                {'insertText': {'location': {'index': index}, 'text': project_text}},
                {'updateTextStyle': {
                    'range': {'startIndex': index, 'endIndex': index + len(project_text) - 1},
                    'textStyle': {'bold': True},
                    'fields': 'bold'
                }}
            ])
            index += len(project_text)

            if item.get('impact'):
                impact_text = f"{item['impact']}\n"
                requests.append({'insertText': {'location': {'index': index}, 'text': impact_text}})
                index += len(impact_text)

            if item.get('technologies'):
                tech_text = f"Technologies: {', '.join(item['technologies'])}\n"
                requests.append({'insertText': {'location': {'index': index}, 'text': tech_text}})
                index += len(tech_text)

        elif item_type == 'certifications':
            cert_header = f"{item.get('name', '')} — {item.get('issuer', '')}"
            if item.get('date'):
                cert_header += f" ({item['date']})"
            cert_text = cert_header + "\n"

            requests.extend([
                {'insertText': {'location': {'index': index}, 'text': cert_text}},
                {'updateTextStyle': {
                    'range': {'startIndex': index, 'endIndex': index + len(item.get('name', ''))},
                    'textStyle': {'bold': True},
                    'fields': 'bold'
                }}
            ])
            index += len(cert_text)

        # Add spacing between items
        requests.append({'insertText': {'location': {'index': index}, 'text': '\n'}})
        index += 1

        return requests, index

    def _add_skills_section(self, skills: Dict, index: int) -> tuple:
        """Add skills section."""
        requests = []

        # Section title
        title_text = "SKILLS\n"
        requests.extend([
            {'insertText': {'location': {'index': index}, 'text': title_text}},
            {
                'updateTextStyle': {
                    'range': {'startIndex': index, 'endIndex': index + len(title_text) - 1},
                    'textStyle': {
                        'bold': True,
                        'fontSize': {'magnitude': 13, 'unit': 'PT'}
                    },
                    'fields': 'bold,fontSize'
                }
            }
        ])
        index += len(title_text)

        # Underline
        line_text = '─' * 80 + '\n'
        requests.append({'insertText': {'location': {'index': index}, 'text': line_text}})
        index += len(line_text)

        # Languages
        if skills.get('languages'):
            lang_text = f"Languages: {', '.join(skills['languages'])}\n"
            requests.append({'insertText': {'location': {'index': index}, 'text': lang_text}})
            index += len(lang_text)

        # Tools
        if skills.get('tools'):
            tools_text = f"Tools: {', '.join(skills['tools'])}\n"
            requests.append({'insertText': {'location': {'index': index}, 'text': tools_text}})
            index += len(tools_text)

        # Methods
        if skills.get('methods'):
            methods_text = f"Methods: {', '.join(skills['methods'])}\n"
            requests.append({'insertText': {'location': {'index': index}, 'text': methods_text}})
            index += len(methods_text)

        return requests, index

    def _format_date_range(self, start: Optional[str], end: Optional[str]) -> str:
        """Format date range."""
        if not start:
            return ""

        if end:
            return f"{start} – {end}"
        return f"{start} – Present"
