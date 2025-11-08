import type { CustomCategoryTemplate, CustomFieldDefinition, CategoryTemplateType } from '../types/models';

const STORAGE_KEY = 'custom_category_templates';

class CustomCategoryService {
  // Get all custom category templates
  getTemplates(): CustomCategoryTemplate[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load custom category templates:', error);
      return [];
    }
  }

  // Get templates filtered by type (asset or liability)
  getTemplatesByType(categoryType: CategoryTemplateType): CustomCategoryTemplate[] {
    const templates = this.getTemplates();
    return templates.filter(t => t.categoryType === categoryType);
  }

  // Get a single template by ID
  getTemplateById(id: string): CustomCategoryTemplate | null {
    const templates = this.getTemplates();
    return templates.find(t => t.id === id) || null;
  }

  // Get a template by name
  getTemplateByName(name: string): CustomCategoryTemplate | null {
    const templates = this.getTemplates();
    return templates.find(t => t.name.toLowerCase() === name.toLowerCase()) || null;
  }

  // Save a new template
  createTemplate(data: {
    name: string;
    categoryType: CategoryTemplateType;
    description?: string;
    icon?: string;
    fields: Omit<CustomFieldDefinition, 'value'>[];
  }): CustomCategoryTemplate {
    const templates = this.getTemplates();

    // Check if template with same name and type exists
    const existing = templates.find(
      t => t.name.toLowerCase() === data.name.toLowerCase() && t.categoryType === data.categoryType
    );
    if (existing) {
      throw new Error(`A custom ${data.categoryType} category named "${data.name}" already exists`);
    }

    const newTemplate: CustomCategoryTemplate = {
      id: `template-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: data.name,
      categoryType: data.categoryType,
      description: data.description,
      icon: data.icon,
      fields: data.fields,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    templates.push(newTemplate);
    this.saveTemplates(templates);
    return newTemplate;
  }

  // Update an existing template
  updateTemplate(id: string, updates: Partial<Omit<CustomCategoryTemplate, 'id' | 'createdAt'>>): CustomCategoryTemplate {
    const templates = this.getTemplates();
    const index = templates.findIndex(t => t.id === id);

    if (index === -1) {
      throw new Error('Template not found');
    }

    // Check if name is being changed and if it conflicts
    if (updates.name && updates.name !== templates[index].name) {
      const existing = templates.find(
        t => t.id !== id && 
        t.name.toLowerCase() === updates.name!.toLowerCase() && 
        t.categoryType === templates[index].categoryType
      );
      if (existing) {
        throw new Error(`A custom category named "${updates.name}" already exists`);
      }
    }

    templates[index] = {
      ...templates[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.saveTemplates(templates);
    return templates[index];
  }

  // Delete a template
  deleteTemplate(id: string): void {
    const templates = this.getTemplates();
    const filtered = templates.filter(t => t.id !== id);
    this.saveTemplates(filtered);
  }

  // Create fields with values from a template
  createFieldsFromTemplate(templateId: string): CustomFieldDefinition[] {
    const template = this.getTemplateById(templateId);
    if (!template) {
      throw new Error('Template not found');
    }

    return template.fields.map(field => ({
      ...field,
      id: `field-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      value: null,
    }));
  }

  // Save templates to localStorage
  private saveTemplates(templates: CustomCategoryTemplate[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
    } catch (error) {
      console.error('Failed to save custom category templates:', error);
      throw new Error('Failed to save templates');
    }
  }
}

export const customCategoryService = new CustomCategoryService();

